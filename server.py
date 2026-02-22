import http.server
import socketserver
import os
import json

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TEMPLATE_PATH = os.path.join(BASE_DIR, "template.html")
CONTENT_PATH = os.path.join(BASE_DIR, "content.json")
STATIC_DIR = os.path.join(BASE_DIR, "static")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
                self.wfile.write(f.read().encode("utf-8"))
        elif self.path == "/content.json":
            self.send_response(200)
            self.send_header("Content-type", "application/json; charset=utf-8")
            self.end_headers()
            with open(CONTENT_PATH, "r", encoding="utf-8") as f:
                self.wfile.write(f.read().encode("utf-8"))
        elif self.path.startswith("/static/"):
            file_path = os.path.join(BASE_DIR, self.path.lstrip("/"))
            if os.path.isfile(file_path):
                if file_path.endswith(".css"):
                    ctype = "text/css"
                elif file_path.endswith(".js"):
                    ctype = "application/javascript"
                elif file_path.endswith(".png"):
                    ctype = "image/png"
                elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
                    ctype = "image/jpeg"
                elif file_path.endswith(".svg"):
                    ctype = "image/svg+xml"
                else:
                    ctype = "application/octet-stream"
                self.send_response(200)
                self.send_header("Content-type", ctype)
                self.end_headers()
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "File not found")
        else:
            self.send_error(404, "Not found")


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Musonda’s CyberShield Academy running at http://localhost:{PORT}")
        httpd.serve_forever()