# warehouse_ptMKN
test coding membuat sistem warehouse management

Dalam project tersebut terbagi atas 2 folder yaitu Backend  (Express.JS) dan Frontend (React.JS) dan juga Database Postgres SQL.
Untuk menjalankan project silahkan masuk ke directory project dan jalankan script docker dengan langkah-langkah sebagai berikut : 
1. Build Dockerfile dengan command "docker-compose up --build -d"
2. Running semua container dalam Dockerfile dengan command "docker-compose up -d"
3. Salin database dump file yang telah disertakan dalam project ke dalam container db dengan script "docker cp warehouse_mkn_backup.dump warehouse_db:/tmp/warehouse_mkn_backup.dump"
4. Restore database dengan langkah-langkah :
     - Masuk ke Linux terminal tempat db berada -> "docker exec -it warehouse_db bash"
     - ketika sudah masuk lalu ketik script berikut untuk restore dump file -> "pg_restore -U postgres -d warehouse_mkn /tmp/warehouse_mkn_backup.dump"
     - test database hasil restore dengan cara buka db nya -> "psql -U postgres -d warehouse_mkn"
     - lalu coba periksa isi table di db tersebut -> "\dt"
     - ketika semua berhasil sistem sudah bisa digunakan
6. coba jalankan project dengan mengakses url : http//:localhost:3000

NOTE : 
1. karena dalam database tersebut saya dump bersama isi datanya, anda bisa login dengan akun :
    => usernam: musa48, password: 48family
2. jika ingin buat akun baru di endpoint, silahkan buka url di tools seperti postmant dengan ketentuan :
   - url http://localhost:4000/auth/register
   - method:post
   - param(nama_pengguna, username, pass_user, role_user{admin,staff})
