# live-bookmarks

save tagged bookmarks for smart search

```
docker run --name live-bookmarks --restart unless-stopped -p 3033:3033 -e DB_PORT=5432 -e DB_HOST=localhost -e DB_USER=postgres -e DB_PASSWORD=password -e DB_NAME=live_bookmarks -e API_KEY=secret-key
```
