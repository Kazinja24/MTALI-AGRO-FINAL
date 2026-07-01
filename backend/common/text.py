from html import unescape
from html.parser import HTMLParser
import re

CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
COLLAPSE_SPACES = re.compile(r"[ \t\f\v]+")
MULTIPLE_BLANK_LINES = re.compile(r"\n{3,}")


class _TextStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self._parts = []
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self._skip_depth:
            self._skip_depth -= 1

    def handle_data(self, data):
        if not self._skip_depth:
            self._parts.append(data)

    def get_text(self):
        return "".join(self._parts)


def sanitize_text(value, *, collapse_whitespace=False, allow_blank=True):
    if value is None:
        return None if allow_blank else ""

    stripper = _TextStripper()
    stripper.feed(str(value))
    stripper.close()

    text = unescape(stripper.get_text())
    text = CONTROL_CHARS.sub("", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    if collapse_whitespace:
        text = COLLAPSE_SPACES.sub(" ", text)
        text = re.sub(r"\n\s+", "\n", text)

    text = MULTIPLE_BLANK_LINES.sub("\n\n", text).strip()
    if not text and allow_blank:
        return None
    return text
