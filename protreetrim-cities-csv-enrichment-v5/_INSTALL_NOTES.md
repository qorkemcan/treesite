# ProTreeTrim V5 - Priority Cities CSV Enrichment

This package updates only:

src/data/cities.csv

What changed:
- Preserved all 800 existing rows.
- Preserved columns: City, County, Population, Description, NearbyCities, MainTreeType, Landmark, FocusService.
- Updated Description text for 37 priority cities.
- No routing, sitemap, noindex, layout, or template files were changed.

Updated cities:
- Jacksonville
- Miami
- Tampa
- Orlando
- Cape Coral
- Tallahassee
- Fort Lauderdale
- Hollywood
- Gainesville
- Miramar
- Coral Springs
- Palm Bay
- West Palm Beach
- Spring Hill
- Clearwater
- Lakeland
- Brandon
- Pompano Beach
- Miami Gardens
- Riverview
- Davie
- Palm Coast
- Plantation
- Fort Myers
- The Villages
- Daytona Beach
- North Fort Myers
- DeLand
- Cooper City
- Lutz
- Destin
- Lake City
- Macclenny
- Glen Saint Mary
- Homosassa
- Masaryktown
- Dune Allen Beach

Recommended install:

1. Copy this ZIP to the repository root.
2. Unzip and apply:

   unzip -o protreetrim-cities-csv-enrichment-v5.zip
   rsync -av protreetrim-cities-csv-enrichment-v5/ ./
   npm run build

3. If build succeeds:

   git status --short
   git diff --stat
   git add src/data/cities.csv
   git commit -m "Enrich priority city descriptions"
   git push origin cities-csv-enrichment-v5

Notes:
- This is intentionally a data-only update.
- No noindex rules were added.
- Sitemap files may be regenerated during build. Commit only src/data/cities.csv unless you intentionally want to commit regenerated sitemap files.
