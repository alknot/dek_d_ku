'use client';
import React from 'react';
import {
  Document,
  PDFDownloadLink,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  Font,
} from '@react-pdf/renderer';


// ลงทะเบียนฟอนต์ Sarabun จากไฟล์ใน public/fonts (ถ้ามี)
Font.register({
  family: 'Sarabun',
  src: '/fonts/Sarabun/Sarabun-Regular.ttf',
});

// สร้างสไตล์สำหรับ PDF Document โดยใช้ฟอนต์ Sarabun
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    lineHeight: 1.4,
    fontFamily: 'Sarabun',
  },
  headerImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Sarabun',
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    textDecoration: 'underline',
    fontFamily: 'Sarabun',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    fontFamily: 'Sarabun',
  },
  tableRow: {
    flexDirection: 'row',
    fontFamily: 'Sarabun',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#e4e4e4',
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  summaryText: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 1.6,
    fontFamily: 'Sarabun',
  },
});

// สร้าง Document Component โดยเพิ่ม Image เข้าไป (เช่น Logo ของเอกสาร)
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* เพิ่มรูป (Image) ที่ด้านบน */}
      <Image
        style={styles.headerImage}
        src="/images/Logo_ku_th.svg.png" // เปลี่ยนเป็น URL ของรูปที่ต้องการ
      />
      
      {/* ส่วนที่ 1: สรุปทุนการศึกษาทั้งหมด */}
      <Text style={styles.subtitle}>ประกาศมหาวิทยาลัยเกษตรศาสตร์</Text>
      <Text style={styles.subtitle}>
        เรื่อง นิสิตทีมีผลงานดีเด่นด้านกิจกรรมเสริมหลักสูตร ประจำ (term) ปีการศึกษา (academicYear) 
      </Text>

      <Text style={styles.sectionTitle}>ประเภททุนการศึกษา</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>ประเภททุน</Text>
          <Text style={styles.tableColHeader}>จำนวนทุน</Text>
          <Text style={styles.tableColHeader}>จำนวนเงิน (บาท)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>
            ทุนอุดหนุนการศึกษาแก่นิสิตป.ตรี (ผ่านส่วนกลางของมก.)
          </Text>
          <Text style={styles.tableCol}>735</Text>
          <Text style={styles.tableCol}>14,891,300</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>
            ทุนอุดหนุนการศึกษาแก่นิสิตที่ได้รับจากมก.
          </Text>
          <Text style={styles.tableCol}>6,514</Text>
          <Text style={styles.tableCol}>57,001,300</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>
            ทุนอุดหนุนการศึกษาแก่นิสิตของคณะ
          </Text>
          <Text style={styles.tableCol}>2,879</Text>
          <Text style={styles.tableCol}>38,830,070</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>ทุนอื่น ๆ ของคณะ</Text>
          <Text style={styles.tableCol}>586</Text>
          <Text style={styles.tableCol}>11,535,600</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>รวม</Text>
          <Text style={styles.tableColHeader}>10,714</Text>
          <Text style={styles.tableColHeader}>122,258,270</Text>
        </View>
      </View>

      {/* ส่วนที่ 2: สรุปทุนส่วนกลางของมหาวิทยาลัย */}
      <Text style={styles.sectionTitle}>
        สรุปทุนการศึกษาปีการศึกษา 2566 ส่วนกลางของมหาวิทยาลัย
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>วิทยาเขต</Text>
          <Text style={styles.tableColHeader}>จำนวนทุน</Text>
          <Text style={styles.tableColHeader}>จำนวนเงิน (บาท)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>บางเขน</Text>
          <Text style={styles.tableCol}>439</Text>
          <Text style={styles.tableCol}>8,777,400</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>วิทยาเขตกาแพงแสน</Text>
          <Text style={styles.tableCol}>134</Text>
          <Text style={styles.tableCol}>2,947,900</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>วิทยาเขตศรีราชา</Text>
          <Text style={styles.tableCol}>80</Text>
          <Text style={styles.tableCol}>1,331,000</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>วิทยาเขตเฉลิมพระเกียรติจังหวัดสกลนคร</Text>
          <Text style={styles.tableCol}>81</Text>
          <Text style={styles.tableCol}>1,795,000</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>วิทยาลัยการชลประทาน</Text>
          <Text style={styles.tableCol}>1</Text>
          <Text style={styles.tableCol}>40,000</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>รวม</Text>
          <Text style={styles.tableColHeader}>735</Text>
          <Text style={styles.tableColHeader}>14,891,300</Text>
        </View>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>รายชื่อนิสิตผู้ได้รับทุน</Text>

      <View style={styles.table}>
        {/* หัวตาราง */}
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>ลำดับ </Text>
          <Text style={styles.tableColHeader}>ชื่อ-สกุล</Text>
          <Text style={styles.tableColHeader}>คณะ</Text>
          <Text style={styles.tableColHeader}>สาขา</Text>
          <Text style={styles.tableColHeader}>หมายเหตุ</Text>
        </View>

        {/* รายการนิสิต */}
        {/* {studentList.map((student) => (
          <View style={styles.tableRow} key={student.no}>
            <Text style={styles.tableCol}>{student.no}</Text>
            <Text style={styles.tableCol}>{student.name}</Text>
            <Text style={styles.tableCol}>{student.faculty}</Text>
            <Text style={styles.tableCol}>{student.department}</Text>
            <Text style={styles.tableCol}>{student.note}</Text>
          </View>
        ))} */}
      </View>

      <Text style={{ marginTop: 30, fontSize: 12 }}>
        (ลงชื่อ) .......................................................
      </Text>
      <Text style={{ marginTop: 5, fontSize: 10 }}>
        ผู้อนุมัติทุนการศึกษา
      </Text>
    </Page>
  </Document>
);

const App = () => (
  <div>
   
    <PDFViewer width="100%" height="1200">
      <MyDocument />
    </PDFViewer>
    {/* <div style={{ marginTop: 20, textAlign: 'center' }}>
      <PDFDownloadLink document={<MyDocument />} fileName="ScholarshipSummary2566.pdf">
        {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
      </PDFDownloadLink>
    </div> */}
  </div>
);

export default App;
