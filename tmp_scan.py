import re
import pathlib
root = pathlib.Path('src/views')
for path in sorted(root.rglob('*.tsx')):
    lines = path.read_text(encoding='utf-8').splitlines()
    for i, line in enumerate(lines, 1):
        for m in re.finditer(r'"([^\"]{2,})"|\'([^\\\']{2,})\'', line):
            s = m.group(1) or m.group(2)
            if re.search(r'[A-Za-z]', s) and not re.search(r'^[A-Za-z0-9_./:-]+$', s):
                if any(tok in line for tok in ['import ', 'from ', 'href=', 'src=', 'to=', 'className=', 'description=', 'title=', 'keywords=']):
                    continue
                print(f"{path}:{i}:{s}")
