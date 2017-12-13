#!/bin/bash

echo "##### "
echo "##### prefetch test 环境 CDN"
echo "#####"

NODE_ENV=test node ./scripts/cdn_refresh_urls.js
