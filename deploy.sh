
echo "Syncing *.css files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.css' --content-encoding 'gzip' build s3://newsapps.test.texastribune.org

echo "Syncing *.js files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.js' --content-encoding 'gzip' build s3://newsapps.test.texastribune.org

echo "Syncing *.html files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.html' --content-encoding 'gzip' build s3://newsapps.test.texastribune.org

echo "Syncing image files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.jpg' --include '*.png' --include '*.gif' build s3://newsapps.test.texastribune.org

echo "Syncing *.svg files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.svg' build s3://newsapps.test.texastribune.org

echo "Syncing *.json files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.json' --content-encoding 'gzip' build s3://newsapps.test.texastribune.org

echo "Syncing everything else to S3..."
aws s3 sync --profile newsapps build s3://newsapps.test.texastribune.org