    document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Ambil data ulang tahun
        const ultahRes = await fetch("./data/ultah.json");
        const ultahData = await ultahRes.json();

        // Ambil data kata ucapan
        const kataRes = await fetch("./data/kata.json");
        const kataData = await kataRes.json();

        let closestPerson = null;
        let closestDate = null;
        let closestDiff = Infinity;
        let formattedDate = null;
        let umurultah = null;

        // Dapatkan tanggal hari ini dalam format MM-DD
        const today = new Date();
        const todayStr = (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                         today.getDate().toString().padStart(2, '0');

        const namaultahEl = document.getElementById("namaultah");
        const ultahconditionEl = document.getElementById("ultahcondition");
        const ucapanultahEl = document.getElementById("ucapanultah");
        const ultahlistEl = document.getElementById("ultahlist");
        const backgroundultah1 = document.getElementById("backgroundultah");

        // Tampilkan semua daftar ultah ke dalam ultahlist
        ultahlistEl.innerHTML = ""; // Clear dulu
        function hitungUmur(birthdateStr) {
            const today = new Date();
            const birthDate = new Date(birthdateStr);

            let umur = today.getFullYear() - birthDate.getFullYear();
            const bulanSekarang = today.getMonth();
            const hariSekarang = today.getDate();

            const bulanLahir = birthDate.getMonth();
            const hariLahir = birthDate.getDate();

            if (bulanSekarang < bulanLahir || (bulanSekarang === bulanLahir && hariSekarang < hariLahir)) {
                umur--; // Belum ultah tahun ini
            }

            return umur;
        }


        ultahData.forEach(person => {
            const [year, month, day] = person.birthdate.split("-");
            const mmdd = `${month}-${day}`;
            const isToday = mmdd === todayStr;

            // Hitung selisih hari dari hari ini
            const thisYear = today.getFullYear();
            const personBorn = new Date(`${year}-${month}-${day}`);
            const personDate = new Date(`${thisYear}-${month}-${day}`);
            const formattedBorn = personBorn.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
                });
            if (personDate < today) {
                // Kalau sudah lewat, cek tahun depan
                personDate.setFullYear(thisYear + 1);
            }

            const diffInDays = Math.floor((personDate - today) / (1000 * 60 * 60 * 24));

            // Ini untuk menentukan orang yang paling dekat dengan hari ini
            // diffInDays itu selalu terupdate menjadi oranng yang paling dekat
            const div = document.createElement("div");
            div.className = "flex justify-between bg-gray-100 text-black p-2 rounded hover:scale-110 hover:rotate-1 transition";
            div.innerHTML = `
                <span>${person.name}</span>
                <span>${formattedBorn}</span>
            `;
            ultahlistEl.appendChild(div);

            if (isToday) {
                div.classList.add("glowing");
                umurultah = hitungUmur(person.birthdate);
            }

            if (!isToday && diffInDays < closestDiff) {
                closestDiff = diffInDays;
                closestPerson = person.name;
                closestDate = formattedBorn;
                umurultah = hitungUmur(person.birthdate);
            }

            

            
        });

        // Kalau gak ada yang ultah hari ini, glowing orang yang paling deket ultahnya
        if (closestPerson) {
            const allItems = ultahlistEl.querySelectorAll("div");
            allItems.forEach(item => {
                if (item.textContent.includes(closestPerson)) {
                    item.classList.add("glowing");
                }
            });
        }


        // Cari siapa yang ultah hari ini
        const ultahHariIni = ultahData.filter(person => {
            const [year, month, day] = person.birthdate.split("-");
            const mmdd = `${month}-${day}`;
            return mmdd === todayStr;
        });

        if (ultahHariIni.length > 0) {
            // Ambil salah satu nama yang ultah
            const orangUltah = ultahHariIni[0];
            namaultahEl.textContent = `Happy Birthday ${orangUltah.name}!`;
            ultahconditionEl.textContent = `ke ${umurultah}!`;
            const div2 = document.createElement("img");
            div2.className = "absolute inset-0 -z-10 size-full object-cover object-center";
            div2.src = "./images/background.png";
            backgroundultah1.classList.remove("bg-blue-900");
            backgroundultah1.classList.remove("py-12");
            backgroundultah1.classList.add("py-38");
            backgroundultah1.classList.add("sm:py-48");
            backgroundultah1.appendChild(div2);
            // Ambil ucapan acak
            const ucapanAcak = kataData[Math.floor(Math.random() * kataData.length)];
            ucapanultahEl.textContent = ucapanAcak;
        } else {
            namaultahEl.textContent = `${closestDiff} hari lagi ultahnya "${closestPerson}" yang ke ${umurultah + 1} lho!`;
            ultahconditionEl.textContent = ``;
            ucapanultahEl.textContent = `Pada ${closestDate}`;
        }

    } catch (error) {
        console.error("Gagal memuat data ulang tahun atau ucapan:", error);
    }
});