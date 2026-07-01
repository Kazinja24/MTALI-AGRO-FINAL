from .base import *  # noqa: F401,F403

if DEBUG:
    from .development import *  # noqa: F401,F403
else:
    from .production import *  # noqa: F401,F403
