# Belajar Git Stash

Git Stash digunakan untuk menyimpan perubahan sementara tanpa harus membuat commit.

## 1. Git Stash
Perintah:
`git stash`

Menyimpan perubahan sementara pada file yang sudah dilacak Git.

## 2. Git Stash Untracked
Perintah:
`git stash push -u -m "Latihan Git Stash"`

Menyimpan perubahan termasuk file yang belum dilacak Git.

## 3. Git Stash List
Perintah:
`git stash list`

Melihat daftar perubahan yang tersimpan.

## 4. Git Stash Apply
Perintah:
`git stash apply`

Mengembalikan perubahan tanpa menghapus stash dari daftar.

## 5. Git Stash Pop
Perintah:
`git stash pop`

Mengembalikan perubahan sekaligus menghapus stash dari daftar jika berhasil.

## 6. Git Stash Show
Perintah:
`git stash show`

Melihat ringkasan perubahan yang tersimpan dalam stash.

## 7. Git Stash Drop
Perintah:
`git stash drop`

Menghapus satu stash tertentu dari daftar.

## 8. Git Stash Clear
Perintah:
`git stash clear`

Menghapus seluruh stash yang tersimpan. Gunakan dengan hati-hati.

## Kesimpulan
Git Stash membantu menyimpan dan mengelola perubahan sementara ketika sedang mengerjakan proyek tanpa harus langsung membuat commit.