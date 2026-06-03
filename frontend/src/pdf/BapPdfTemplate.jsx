import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,         // Dikurangi dari 34 agar lebih naik
    paddingBottom: 24,      // Dikurangi dari 34
    paddingHorizontal: 32,  // Sisi kiri kanan disesuaikan
    fontSize: 8,            // Ukuran font diturunkan dari 8.5 ke 8 agar teks lebih padat
    fontFamily: 'Helvetica',
    color: '#000',
    lineHeight: 1.2,        // Jarak baris dirapatkan dari 1.25 ke 1.2
  },
  header: {
    textAlign: 'center',
    marginBottom: 6,        // Dikurangi dari 10
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  intro: {
    marginBottom: 4,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 1,
  },
  block: {
    marginBottom: 2,        // Dikurangi dari 4
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,        // Dikurangi dari 1.5
  },
  label: {
    width: 96,
  },
  colon: {
    width: 10,
  },
  value: {
    flex: 1,
  },
  valueBold: {
    flex: 1,
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 3,        // Dikurangi dari 4
    textAlign: 'justify',
  },
  // Style untuk Tabel Tanda Tangan Utama
  tableSignature: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 6,           // Dikurangi dari 10
    marginBottom: 6,        // Dikurangi dari 10
  },
  colSignature: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,             // Dikurangi dari 6
    textAlign: 'center',
  },
  colSignatureLast: {
    flex: 1,
    padding: 4,             // Dikurangi dari 6
    textAlign: 'center',
  },
  titleSignature: {
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    marginBottom: 50,       // Dikurangi dari 40 agar menghemat ruang vertikal signifikan
  },
  nameSignature: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  // Style untuk Tabel Kuasa RE-DESAIN
  proxyHeaderContainer: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#000',
    padding: 3,
    marginTop: 4,           // Dikurangi dari 10
  },
  proxyHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8.5,
  },
  proxyContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
    marginBottom: 5,
  },
  proxyLeftBlock: {
    width: '70%',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  proxyLeftRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  proxyLeftRowLast: {
    flexDirection: 'row',
  },
  proxyLabelCol: {
    width: '40%',
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  proxyLabelText: {
    fontSize: 7.5,
  },
  proxyLabelTextSmall: {
    fontSize: 6,
    fontStyle: 'italic',
  },
  proxyValueCol: {
    flex: 1,
    padding: 3,
  },
  proxyValueText: {
    fontSize: 7.5,
  },
  signatureSpace: {
    height: 22,             // Dikurangi dari 35 agar pas di satu halaman
  },
  proxyRightBlock: {
    width: '30%',
    padding: 4,
  },
  // Lain-lain / Lampiran
  appendixTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 6,
  },
  appendixSectionTitle: {
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 1,
  },
  rightNote: {
    marginTop: 12,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  boxIndicator: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
    marginTop: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2.5,
  },
  checkText: {
    flex: 1,
    fontSize: 8,
  },
  // Tempatkan ini di dalam StyleSheet.create Anda
  parafContainer: {
    position: 'absolute',
    bottom: 40,            // Jarak kotak dari batas bawah kertas
    right: 40,             // Jarak kotak dari batas kanan kertas
    width: 140,            // Lebar kotak kotak paraf
    height: 70,            // Tinggi kotak kosong untuk paraf
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
  },
  parafText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    color: '#000000',
  }
});

const ones = [
  'Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
  'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
];

function toWords(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return '';
  if (n < 0) return `Minus ${toWords(Math.abs(n))}`;
  if (n < 12) return ones[n];
  if (n < 20) return `${toWords(n - 10)} Belas`;
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const rest = n % 10;
    return `${toWords(tens)} Puluh${rest ? ` ${toWords(rest)}` : ''}`;
  }
  if (n < 200) {
    const rest = n - 100;
    return `Seratus${rest ? ` ${toWords(rest)}` : ''}`;
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    return `${toWords(hundreds)} Ratus${rest ? ` ${toWords(rest)}` : ''}`;
  }
  if (n < 2000) {
    const rest = n - 1000;
    return `Seribu${rest ? ` ${toWords(rest)}` : ''}`;
  }
  if (n < 10000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    return `${toWords(thousands)} Ribu${rest ? ` ${toWords(rest)}` : ''}`;
  }
  return String(n);
}

function capitalizeWords(text) {
  return String(text)
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatIndonesianDateWords(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(date.getTime())) {
    return {
      weekday: 'Selasa',
      day: 'Dua Puluh Sembilan',
      month: 'Oktober',
      year: 'Dua Ribu Dua Puluh Empat',
    };
  }

  const weekday = capitalizeWords(date.toLocaleDateString('id-ID', { weekday: 'long' }));
  const day = toWords(date.getDate());
  const month = capitalizeWords(date.toLocaleDateString('id-ID', { month: 'long' }));
  const year = toWords(date.getFullYear());

  return { weekday, day, month, year };
}

function Field({ label, value, bold = false, labelWidth = 96 }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { width: labelWidth }]}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={bold ? styles.valueBold : styles.value}>{value}</Text>
    </View>
  );
}

function CheckBoxItem({ label }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.boxIndicator} />
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );
}

function NumberedItem({ num, text, paddingLeft = 0, numWidth = 32, isBold = false }) {
  return (
    <View style={[styles.row, { paddingLeft: paddingLeft, marginBottom: 1.5, alignItems: 'flex-start' }]}>
      <Text style={{ width: numWidth, fontWeight: isBold ? 'bold' : 'normal' }}>{num}</Text>
      <Text style={{ flex: 1, textAlign: 'justify', fontWeight: isBold ? 'bold' : 'normal' }}>{text}</Text>
    </View>
  );
}

export default function BapPdfTemplate({ data = {} }) {
  const docDate =
    data.documentDate ||
    data.tanggalDokumen ||
    new Date().toISOString().split('T')[0];
  const dateParts = formatIndonesianDateWords(docDate);

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const noBAP = data.noBAP || '7492.BA/MUM.01.02/F01080400/2024';
  const penyedia = data.penyedia || 'Michael R Matitamole';
  const pengguna = data.calonPengguna || 'AHMAD FATHURROHMAN';
  const nip = data.nip || '9519449ZY';
  const jabatanPengguna = data.jabatanPengguna || 'TL JARGI (GI BAGENDANG)';
  const noHp = data.noHp || '085385375965';
  const kedudukanPengguna =
    data.personalArea || data.kedudukanPengguna || 'Jl H.M Arsyad KM 29, begendang hilir, kecamatan mentaya hilir utara, kab kotawaringin timur';
  const alamatPenyedia =
    data.alamatPenyedia || 'Jl. KH Abdul Rochim no.1 Kuningan Barat, Mampang Jakarta Selatan 12710';
  const jabatanPenyedia =
    data.jabatanPenyedia || 'MANAGER PLN SEAT MANAGEMENT pada BIDANG PLN SEAT MANAGEMENT - DIVISI PELAYANAN PLN';
  const perangkat = data.spesifikasi || 'MS Laptop HP';
  const sn = data.sn || '5CD4374R37';
  const noPA = data.noPA || '0001/DAN.01.03/10095521/2024';
  const penyetuju = data.penyetuju || 'DICKY AGUS SETIAWAN';

  return (
    <Document>
      {/* --- HALAMAN 1 --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>BERITA ACARA SERAH TERIMA PERANGKAT</Text>
          <Text style={styles.subtitle}>Nomor: {noBAP}</Text>
        </View>

          <Text style={styles.intro}>
            Pada hari ini, <Text style={styles.boldText}>{dateParts.weekday}</Text> tanggal <Text style={styles.boldText}>{dateParts.day}</Text> bulan <Text style={styles.boldText}>{dateParts.month}</Text> tahun <Text style={styles.boldText}>{dateParts.year}</Text> kami yang bertanda tangan di bawah ini:
          </Text>

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>I. PENYEDIA LAYANAN</Text>
          <Field label="Nama" value={penyedia} bold />
          <Field label="Jabatan" value={jabatanPenyedia} />
          <Field label="Berkedudukan" value={alamatPenyedia} />
          <Field label="Selanjutnya disebut" value="PENYEDIA LAYANAN" bold />
        </View>

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>II. PENGGUNA LAYANAN</Text>
          <Field label="Nama" value={pengguna} bold />
          <Field label="NIP" value={nip} />
          <Field label="Jabatan" value={jabatanPengguna} />
          <Field label="Nomor HP" value={noHp} />
          <Field label="Berkedudukan" value={kedudukanPengguna} />
          <Field label="Selanjutnya disebut" value="PENGGUNA LAYANAN" bold />
        </View>

        <Text style={styles.paragraph}>
          telah dilakukan serah terima perangkat dengan rincian sebagai berikut:
        </Text>

        <Text style={styles.paragraph}>
          1. PENYEDIA LAYANAN telah menyerahkan kepada PENGGUNA LAYANAN dan PENGGUNA LAYANAN telah menerima dari PENYEDIA LAYANAN Perangkat:
        </Text>

        <View style={{ marginLeft: 12, marginBottom: 3 }}>
          <Field label="Perangkat" value={perangkat} bold labelWidth={98} />
          <Field label="Serial Number (SN)" value={sn} bold labelWidth={98} />
          <Field 
            label="Berdasarkan Nomor" 
            value={`PA: ${noPA} Tanggal ${tanggalHariIni}`} 
            labelWidth={98} 
          />
          <Field label="Progress Pekerjaan" value="100% (Seratus Persen)" labelWidth={98} />
        </View>

        <Text style={styles.paragraph}>
          2. Berita Acara ini dapat dijadikan sebagai dasar penagihan dan pembayaran Biaya Layanan Managed Service PC dan/atau Laptop dari {data.unitKerja} kepada PENYEDIA LAYANAN.
        </Text>

        <Text style={styles.paragraph}>
          3. Syarat dan Ketentuan: Dengan ditandatangan Berita Acara ini PENGGUNA LAYANAN bertanggung jawab atas segala sesuatu terkait dengan perangkat yang diterima, dengan Hak dan Kewajiban sebagai berikut:
        </Text>

        <View style={{ paddingLeft: 6, marginBottom: 3 }}>
          <NumberedItem num="3.1" text="Hak PENGGUNA LAYANAN:" numWidth={28} isBold />
          <NumberedItem num="3.1.1" text="Mempergunakan selama PENGGUNA LAYANAN menjabat pada jenjang jabatan sebagaimana yang dimaksud angka II." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.1.2" text="Mendapat perawatan rutin terhadap perangkat yang diambil apabila diminta." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.1.3" text="Mendapatkan perbaikan apabila Perangkat mengalami kerusakan/keluhan." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.1.4" text="Mendapat penggantian sementara apabila perangkat dalam masa perbaikan." paddingLeft={12} numWidth={32} />

          <NumberedItem num="3.2" text="Kewajiban PENGGUNA LAYANAN:" numWidth={28} isBold />
          <NumberedItem num="3.2.1" text="Mengembalikan Perangkat pada PENYEDIA LAYANAN apabila PENGGUNA LAYANAN:" paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.2.1.1" text="Mutasi keluar Holding atau" paddingLeft={24} numWidth={42} />
          <NumberedItem num="3.2.1.2" text="Berhenti bekerja / Purna Karya, atau" paddingLeft={24} numWidth={42} />
          <NumberedItem num="3.2.1.3" text="Berakhirnya masa kontrak sewa perangkat" paddingLeft={24} numWidth={42} />
          
          <NumberedItem num="3.2.2" text="Pengembalian sebagaimana yang dimaksud pada butir 3.2.1 di atas paling lambat 5 (lima) hari kalender setelah Surat Keputusan Mutasi atau lainnya diterima." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.2.3" text="Apabila ada keluhan dapat melaporkan kepada Helpdesk PLN Pusat (email: servicedesk@pln.co.id, atau telepon ke Service Desk PLN: 1500515)." paddingLeft={12} numWidth={32} />
          
          <NumberedItem num="3.2.4" text="Mengganti biaya kerugian perangkat apabila terjadi:" paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.2.4.1" text="Kehilangan (dengan didahului investigasi apakah kejadian didalam/luar kantor)" paddingLeft={24} numWidth={42} />
          <NumberedItem num="3.2.4.2" text="Kerusakan (diluar jaminan)" paddingLeft={24} numWidth={42} />
          <NumberedItem num="3.2.4.3" text="Kelalaian penggunaan (jatuh, banjir, dll)" paddingLeft={24} numWidth={42} />
          
          <NumberedItem num="3.2.5" text="PC Laptop digunakan untuk keperluan dinas." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.2.6" text="Menjaga dan Merawat agar kondisi perangkat dalam kondisi aman, baik dan tidak diperkenankan mengalihkan penggunaan perangkat kepada orang lain tanpa pemberitahuan kepada PIC Pengelola Managed Service PC Laptop di {data.unitKerja}." paddingLeft={12} numWidth={32} />
          <NumberedItem num="3.2.7" text="Tidak diperkenankan menginstall software di luar kewenangan STI." paddingLeft={12} numWidth={32} />
        </View>

        {/* TABEL TANDA TANGAN UTAMA */}
        <View style={styles.tableSignature}>
          <View style={styles.colSignature}>
            <Text style={styles.titleSignature}>PENYETUJU LAYANAN</Text>
            <Text style={styles.nameSignature}>{penyetuju}</Text>
          </View>
          <View style={styles.colSignature}>
            <Text style={styles.titleSignature}>PENYEDIA LAYANAN</Text>
            <Text style={styles.nameSignature}>{penyedia}</Text>
          </View>
          <View style={styles.colSignatureLast}>
            <Text style={styles.titleSignature}>PENGGUNA LAYANAN</Text>
            <Text style={styles.nameSignature}>{pengguna}</Text>
          </View>
        </View>

        {/* HEADER KUASA */}
        <View style={styles.proxyHeaderContainer}>
          <Text style={styles.proxyHeaderText}>
            TANDA TERIMA PERANGKAT DIKUASAKAN KEPADA ATASAN/REKAN KERJA
          </Text>
        </View>

        {/* TABEL KUASA */}
        <View style={styles.proxyContainer}>
          <View style={styles.proxyLeftBlock}>
            <View style={styles.proxyLeftRow}>
              <View style={styles.proxyLabelCol}>
                <Text style={styles.proxyLabelText}>Yang memberikan kuasa*</Text>
                <Text style={styles.proxyLabelTextSmall}>(coret yang tidak perlu)</Text>
              </View>
              <View style={styles.proxyValueCol}>
                <Text style={styles.proxyValueText}>Pengguna / Atasan Pengguna</Text>
              </View>
            </View>

            <View style={styles.proxyLeftRow}>
              <View style={styles.proxyLabelCol}>
                <Text style={styles.proxyLabelText}>Nama Penerima yang dikuasakan</Text>
              </View>
              <View style={styles.proxyValueCol}>
                <Text style={styles.proxyValueText}>{data.namaPenerimaKuasa || ''}</Text>
              </View>
            </View>

            <View style={styles.proxyLeftRow}>
              <View style={styles.proxyLabelCol}>
                <Text style={styles.proxyLabelText}>NIP</Text>
              </View>
              <View style={styles.proxyValueCol}>
                <Text style={styles.proxyValueText}>{data.nipPenerimaKuasa || ''}</Text>
              </View>
            </View>

            <View style={styles.proxyLeftRow}>
              <View style={styles.proxyLabelCol}>
                <Text style={styles.proxyLabelText}>Jabatan</Text>
              </View>
              <View style={styles.proxyValueCol}>
                <Text style={styles.proxyValueText}>{data.jabatanPenerimaKuasa || ''}</Text>
              </View>
            </View>

            <View style={styles.proxyLeftRowLast}>
              <View style={styles.proxyLabelCol}>
                <Text style={styles.proxyLabelText}>Tanda Tangan</Text>
              </View>
              <View style={styles.proxyValueCol}>
                <View style={styles.signatureSpace} /> 
              </View>
            </View>
          </View>

          <View style={styles.proxyRightBlock}>
            <Text style={styles.proxyLabelText}>Keterangan alasan dikuasakan:</Text>
            <Text style={[styles.proxyValueText, { marginTop: 3 }]}>
              {data.alasanKuasa || ''}
            </Text>
          </View>
        </View>
      </Page>

      {/* --- HALAMAN 2: LAMPIRAN --- */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.appendixTitle}>Lampiran:</Text>
        <Text style={styles.paragraph}>Syarat dan Ketentuan yang berlaku apabila terjadi kerusakan:</Text>

        <Text style={styles.appendixSectionTitle}>1. Garansi Layanan</Text>
        <Text style={styles.paragraph}>
          A. Masa berlaku garansi pada perangkat dan layanan sesuai dengan masa layanan yang dihitung sejak Berita Acara Serah Terima Perangkat (BASTP) ditandatangani oleh PARA PIHAK terbit sesuai dengan Pasal 3 Ayat 1 angka 1.2
        </Text>
        <Text style={styles.paragraph}>
          B. Hal-hal yang termasuk Layanan Garansi adalah:
        </Text>
        
        <View style={{ paddingLeft: 8, marginBottom: 3 }}>
          <Text style={styles.paragraph}>- LCD dalam keadaan bergaris atau kondisi gelap yang bukan diakibatkan dari kelalaian Pengguna Layanan.</Text>
          <Text style={styles.paragraph}>- Keyboard tidak berfungsi salah satu tombol atau tidak bisa digunakan sama sekali.</Text>
          <Text style={styles.paragraph}>- Harddisk tidak bisa terdeteksi atau tidak bisa baca file.</Text>
          <Text style={styles.paragraph}>- I/O port tidak berfungsi.</Text>
          <Text style={styles.paragraph}>- Camera layar tidak berfungsi dengan semestinya (blur/berbayang).</Text>
          <Text style={styles.paragraph}>- Kerusakan VGA Card, Kerusakan Memory (RAM).</Text>
        </View>

        <Text style={styles.paragraph}>
          C. Hal-hal yang tidak termasuk didalam garansi, Pengguna Layanan wajib membayar ganti kerugian sebesar biaya penggantian sparepart adalah:
        </Text>
        <Text style={[styles.paragraph, { paddingLeft: 8 }]}>
          Kerusakan dan/atau kehilangan perangkat akibat kecelakaan yang disebabkan oleh kelalaian Pengguna Layanan:
        </Text>
        
        <View style={{ paddingLeft: 16, marginBottom: 3 }}>
          <Text style={styles.paragraph}>- Jatuh yang disengaja atau tidak disengaja.</Text>
          <Text style={styles.paragraph}>- Pencurian dan/atau perampokan.</Text>
          <Text style={styles.paragraph}>- Kecelakaan yang disengaja atau tidak disengaja.</Text>
          <Text style={styles.paragraph}>- Salah dalam penggunaan atau penyimpanan perangkat oleh pengguna.</Text>
          <Text style={styles.paragraph}>- Tegangan arus listrik.</Text>
          <Text style={styles.paragraph}>- Pecah/retak akibat tekanan.</Text>
          <Text style={styles.paragraph}>- Terkena cairan.</Text>
          <Text style={styles.paragraph}>- Tergores, berkarat, terkena noda, berjamur, atau kerusakan luar yang disebabkan penggunaan sehari-hari.</Text>
        </View>

        <Text style={styles.paragraph}>
          D. Kejadian di luar kemampuan (kondisi KAHAR), ganti kerugian akan ditanggung oleh Pengguna Layanan: Kerusakan / kehilangan yang disebabkan oleh kejadian alam (banjir, gempa), dibuktikan dengan kronologis, evidence, keterangan dari pihak-pihak berwajib (RT, RW / Kepolisian).
        </Text>

        <Text style={styles.appendixSectionTitle}>2. Prosedur Penggantian atau Perbaikan Perangkat adanya Insiden</Text>
        <Text style={styles.paragraph}>
          Penyedia Layanan dalam hal Insiden terjadi, Pelanggan berkewajiban untuk:
        </Text>
        <View style={{ paddingLeft: 8, marginBottom: 3 }}>
          <Text style={styles.paragraph}>A. Menghindari upaya untuk memperbaiki sendiri perangkat.</Text>
          <Text style={styles.paragraph}>B. Menghindari penggunaan jasa perbaikan berdasarkan pilihan Pelanggan sendiri untuk memperbaiki perangkat.</Text>
          <Text style={styles.paragraph}>C. Melaporkan klaim kepada Penyedia Layanan berkenaan dengan Kerusakan Yang Tidak Disengaja atau Masuknya Cairan sesuai dengan syarat dan ketentuan.</Text>
        </View>

        <Text style={styles.appendixSectionTitle}>3. Information Instalasi Software</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 4, marginBottom: 3 }}>
          <View style={{ width: '50%' }}><CheckBoxItem label="Windows OS OEM" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Office 365" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Office WPS" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Anti Virus" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Unified Endpoint Management (UEM)" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Endpoint Detection and Response (EDR)" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Extended Detection and Response (XDR)" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Golden Image (WinZip, FireFox, Chrome, Zoom dll)" /></View>
        </View>

        <Text style={styles.appendixSectionTitle}>4. Informasi Kelengkapan Hardware</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 4, marginBottom: 3 }}>
          <View style={{ width: '50%' }}><CheckBoxItem label="Processor Intel Core i7 / R7" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="RAM 16 GB" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Hard Disk 512 GB SSD" /></View>
          <View style={{ width: '50%' }}><CheckBoxItem label="Layar 13.3”" /></View>
        </View>

        <View style={styles.parafContainer}>
          <Text style={styles.parafText}>Paraf</Text>
        </View>
      </Page>
    </Document>
  );
}