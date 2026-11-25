# Belajar Git Reset

Git Reset digunakan untuk memindahkan HEAD ke commit tertentu dan mengatur perubahan pada staging area maupun working directory.

## 1. Git Reset Soft
Perintah:
`git reset --soft HEAD~1`

Mengembalikan HEAD ke commit sebelumnya, tetapi perubahan tetap berada di staging area.

## 2. Git Reset Mixed
Perintah:
`git reset --mixed HEAD`

Mengeluarkan perubahan dari staging area, tetapi perubahan tetap ada di working directory.

## 3. Git Reset Hard
Perintah:
`git reset --hard HEAD~1`

Mengembalikan HEAD ke commit sebelumnya serta menghapus perubahan pada staging area dan working directory. Perintah ini harus digunakan dengan hati-hati karena perubahan yang belum disimpan dapat hilang.

## Kesimpulan
Git Reset memiliki tiga mode utama, yaitu soft, mixed, dan hard. Ketiganya memiliki fungsi berbeda dalam mengatur riwayat commit dan perubahan file.