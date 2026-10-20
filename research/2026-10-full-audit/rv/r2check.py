import json,glob,re,sys
r1={}
for f in glob.glob('rv/out-*.json'):
    for r in json.load(open(f)): r1[r['id']]=r
norm=lambda t:re.sub(r'\s+',' ',t).lower()
for f in sorted(glob.glob('rv/r2-out-*.json')):
  for r in json.load(open(f)):
    if r['verdict']=='keep': continue
    snap=norm(open(f"snapshots/{r['id']}.txt").read())
    for b in r1[r['id']].get('blocking_not_on_page',[]):
        c=b['claim']; toks=re.findall(r'\$[\d,.]+|\d+(?:\.\d+)?\s?%|\b\d{1,3}(?:,\d{3})+\b|\b\d+\b',c)
        miss=[t for t in toks if norm(t).rstrip('.,') not in snap]
        print(('OK  ' if not miss else 'MISS'), r['id'], '|', c[:110], '| missing:',miss if miss else '')
