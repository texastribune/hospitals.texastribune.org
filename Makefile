TEST_AWS_BUCKET := newsapps.test.texastribune.org
PROD_AWS_BUCKET := hospitals.texastribune.org

test-deploy:
	@echo "Building the project..."
	@middleman build

	@echo "Syncing *.css files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.css' --cache-control 'max-age=31536000' --content-encoding 'gzip' build s3://$(TEST_AWS_BUCKET)/

	@echo "Syncing *.js files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.js' --cache-control 'max-age=31536000' --content-encoding 'gzip' build s3://$(TEST_AWS_BUCKET)/

	@echo "Syncing *.html files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.html' --cache-control 'no-cache' --content-encoding 'gzip' build s3://$(TEST_AWS_BUCKET)/

	@echo "Syncing *.json/geojson files to S3"
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.json' --include '*.geojson' --content-encoding 'gzip' build s3://$(TEST_AWS_BUCKET)/

	@echo "Syncing everything else to S3..."
	@aws s3 sync --acl public-read build s3://$(TEST_AWS_BUCKET)/

deploy:
	@echo "Building the project..."
	@middleman build

	@echo "Syncing *.css files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.css' --cache-control 'max-age=31536000' --content-encoding 'gzip' build s3://$(PROD_AWS_BUCKET)/

	@echo "Syncing *.js files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.js' --cache-control 'max-age=31536000' --content-encoding 'gzip' build s3://$(PROD_AWS_BUCKET)/

	@echo "Syncing *.html files to S3..."
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.html' --cache-control 'no-cache' --content-encoding 'gzip' build s3://$(PROD_AWS_BUCKET)/

	@echo "Syncing *.json/geojson files to S3"
	@aws s3 sync --acl public-read --exclude '*.*' --include '*.json' --include '*.geojson' --content-encoding 'gzip' build s3://$(PROD_AWS_BUCKET)/

	@echo "Syncing everything else to S3..."
	@aws s3 sync --acl public-read build s3://$(PROD_AWS_BUCKET)/
