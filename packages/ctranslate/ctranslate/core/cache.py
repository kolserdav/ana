
import os
import hashlib
import pickle
from functools import wraps
import inspect

__cache_dir__ = os.path.join(os.path.abspath('/tmp'))


def _read_from_cache(cache_key):
    cache_file = os.path.join(__cache_dir__, cache_key)
    if os.path.exists(cache_file):
        with open(cache_file, 'rb') as f:
            return pickle.load(f)
    return None


def _write_to_cache(cache_key, value):
    cache_file = os.path.join(__cache_dir__, cache_key)
    if not os.path.exists(__cache_dir__):
        os.mkdir(__cache_dir__)
    with open(cache_file, 'wb') as f:
        pickle.dump(value, f)


def cache_result(fn):
    @wraps(fn)
    def _decorated(*arg, **kw):
        m = hashlib.md5()
        fn_src = inspect.getsourcelines(fn)
        m.update(str(fn_src).encode())
        m.update(str(arg).encode())
        m.update(str(kw).encode())
        cache_key = m.hexdigest()
        cached = _read_from_cache(cache_key)
        if cached is not None:
            return cached

        value = fn(*arg, **kw)
        _write_to_cache(cache_key, value)
        return value

    return _decorated
