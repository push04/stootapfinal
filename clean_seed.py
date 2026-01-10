
import re

file_path = 'server/seed.ts'

with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
in_categories = False
in_services = False
in_site_content = False

for line in lines:
    stripped = line.strip()
    
    if 'const categories: InsertCategory[] = [' in line:
        in_categories = True
    elif 'const services: InsertService[] = [' in line:
        in_services = True
    elif 'const siteContentItems: InsertSiteContent[] = [' in line:
        in_site_content = True
    elif line.strip() == '];':
        in_categories = False
        in_services = False
        in_site_content = False

    if in_categories and stripped.startswith('description:'):
        continue
    if in_services and stripped.startswith('longDescription:'):
        continue
    if in_site_content and stripped.startswith('type:'):
        continue
        
    new_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(new_lines)

print("Cleaned seed.ts")
