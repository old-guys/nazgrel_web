#!/bin/bash

echo "##### "
echo "##### prefetch Pro 环境 CDN"
echo "#####"

NODE_ENV=prod node ./scripts/cdn_refresh_urls.js
