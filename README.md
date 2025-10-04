# warehouse_ptMKN
test coding membuat sistem warehouse management

Dalam project tersebut terbagi atas 2 folder yaitu Backend  (Express.JS) dan Frontend (React.JS) dan juga Database Postgres SQL.
Untuk menjalankan project silahkan masuk ke directory project dan jalankan script docker dengan langkah-langkah sebagai berikut : 
1. Build Dockerfile dengan command "docker-compose up --build -d"
2. Running semua container dalam Dockerfile dengan command "docker-compose up -d"
3. Salin database dump file yang telah disertakan dalam project ke dalam container db dengan script "docker cp warehouse_mkn_backup.dump warehouse_db:/tmp/warehouse_mkn_backup.dump"
4. Restore data : "docker exec -u postgres warehouse_db pg_restore -d warehouse_mkn -v /tmp/warehouse_mkn_backup.dump
5. coba jalankan project dengan mengakses url : http//:localhost:3000
