"""List (default) or apply (--apply id:idx,...) reviewer fixes from rv/out-*.json to public/data.js.
A fix is applied only when its `old` text occurs exactly once in the record's own block."""
import json,glob,sys,re
D='public/data.js'; s=open(D).read()
rows=[]
for f in sorted(glob.glob('research/2026-10-full-audit/rv/out-*.json')):
    for r in json.load(open(f)):
        for k,d in enumerate(r.get('differs',[])): rows.append((r['id'],k,d,f))
def js(t): return json.dumps(t,ensure_ascii=False)[1:-1]
def block(id):
    m=re.search(r'\n    id: "'+re.escape(id)+r'",',s); 
    if not m: return None
    a=s.rfind('\n  {',0,m.start()); b=s.find('\n  },',m.end()); return (a,b)
if '--apply' not in sys.argv:
    for id,k,d,f in rows:
        old=d.get('old'); n=s.count(js(old)) if isinstance(old,str) else 'num'
        print(f"## {id}:{k} [{d.get('field')}] count={n}\n  OLD: {old}\n  NEW: {d.get('new')}\n  QUOTE: {d.get('quote')}\n  WHY: {d.get('why')}")
    sys.exit()
want=set(sys.argv[sys.argv.index('--apply')+1].split(','))
for id,k,d,f in rows:
    if f'{id}:{k}' not in want: continue
    old,new=js(d['old']),js(d['new'])
    c=s.count(old)
    if c!=1: print('SKIP count',c,id,k); continue
    s=s.replace(old,new); print('applied',id,k)
open(D,'w').write(s)
