#!/usr/bin/env python3
"""Static file server with HTTP Range support, needed for video seeking.

Python's stock http.server ignores Range headers and always returns the
full file, which breaks <video> scrubbing/seeking in browsers.
"""
import os
import re
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    # A plain HTTPServer handles one request at a time, so a long-running
    # video download (e.g. a preloaded next clip) blocks every other
    # request — including seeks on the video actually being watched —
    # until it finishes. Each request gets its own thread instead.
    daemon_threads = True


class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None

        range_header = self.headers.get("Range")
        file_size = os.path.getsize(path)

        if range_header is None:
            self.send_response(200)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-type", self.guess_type(path))
            self.send_header("Content-Length", str(file_size))
            self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
            self.end_headers()
            f = open(path, "rb")
            return f

        match = re.match(r"bytes=(\d*)-(\d*)", range_header)
        if not match:
            self.send_error(416, "Invalid Range header")
            return None

        start_str, end_str = match.groups()
        if start_str == "" and end_str == "":
            self.send_error(416, "Invalid Range header")
            return None

        if start_str == "":
            length = int(end_str)
            start = max(0, file_size - length)
            end = file_size - 1
        else:
            start = int(start_str)
            end = int(end_str) if end_str != "" else file_size - 1

        if start >= file_size or end >= file_size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{file_size}")
            self.end_headers()
            return None

        length = end - start + 1

        self.send_response(206)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()

        f = open(path, "rb")
        f.seek(start)
        self._range_remaining = length
        self._orig_read = f.read

        def limited_read(size=-1):
            if self._range_remaining <= 0:
                return b""
            if size < 0 or size > self._range_remaining:
                size = self._range_remaining
            data = self._orig_read(size)
            self._range_remaining -= len(data)
            return data

        f.read = limited_read
        return f


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    directory = sys.argv[2] if len(sys.argv) > 2 else "."
    os.chdir(directory)
    server = ThreadingHTTPServer(("0.0.0.0", port), RangeHTTPRequestHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
