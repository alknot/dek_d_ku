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
    lineHeight: 0.1,
    fontFamily: 'Sarabun',
  },
  startmain: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  main: {
    marginLeft: 50,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  lastmain: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
    marginTop: 10,
  },
  maindate: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
    marginTop: 15,
    textAlign: 'center',
  },
  maintable: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
    textAlign: 'center',
    fontSize: 15,
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
        เรื่อง (schName) 
      </Text>
      <Text style={styles.subtitle}>--------------------------------</Text>

      <Text style={styles.startmain}>ตามที่มหาวิทยาลัยเกษตรศาสตร์ ได้ตราระเบียบว่าด้วยการสร้างค่านิยมที่ดีของนิสิต พ.ศ. ๒๕๕๓</Text>
      

      {/* ส่วนที่ 2: สรุปทุนส่วนกลางของมหาวิทยาลัย */}
      <Text style={styles.main}>
        เพื่อเสริมสร้างให้นิสิตได้มีค่านิยมต่อการประกอบความดีให้ยิ่งๆขึ้นไป นั้น คณะอนุกรรมการพิจารณานิสิตดีเด่น
      </Text>
      <Text style={styles.main}>
        และผู้แทนนิสิตเข้ารับรางวัลพระราชทาน ได้ดำเนินการคัดเลือกนิสิตที่มีผลงานดีเด่นด้านความประพฤติดีเด่นน
      </Text>
      <Text style={styles.main}>
        ประจำ ภาคปลาย ปีการศึกษา 2568 จำนวน 30 คน ที่มีคุณสมบัติตามที่ได้กำหนดไว้ในระเบียบดังกล่าวววว
      </Text>
      <Text style={styles.lastmain}>
        จึงประกาศยกย่องเพื่อมาเป็นเกียรติสืบไป</Text>
    <Text style={styles.maindate}>
        ประกาศ ณ วันที่ </Text>
     
   <Text style={{ marginTop: 30, fontSize: 12 }}>
    (ลงชื่อ) .......................................................
  </Text>
  <Text style={{ marginTop: 5, fontSize: 10 }}>
    ผู้อนุมัติทุนการศึกษา
  </Text>
    </Page>

    <Page size="A4" orientation="landscape" style={styles.page}>
  <Text style={styles.subtitle}>รายชื่อนิสิตที่มีผลงานดีเด่นด้านความประพฤติดี ประจำ(term) ปีการศึกษา (year)</Text>
  <Text style={styles.subtitle}>นิสิตที่ได้รับการยกเว้นธรรมเนียมการศึกษา ประจำ(term) ปีการศึกษา (year)</Text>

  
      <Text style={styles.maintable}>รายชื่อนิสิตผู้ได้รับทุน</Text>

      <View style={styles.table}>
        {/* หัวตาราง */}
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>ลำดับ</Text>
          <Text style={styles.tableColHeader}>รหัสนิสิต</Text>
          <Text style={styles.tableColHeader}>ชื่อ-สกุล</Text>
          <Text style={styles.tableColHeader}>คณะ</Text>
          <Text style={styles.tableColHeader}>สาขาวิชา</Text>
          <Text style={styles.tableColHeader}>หมายเหตุ</Text>
        </View>

        {/* แสดงข้อมูลจาก studentList */}
        {/* {studentList.map((student) => (
          <View style={styles.tableRow} key={student.no}>
            <Text style={styles.tableCol}>{student.no}</Text>
            <Text style={styles.tableCol}>{student.studentId}</Text>
            <Text style={styles.tableCol}>{student.name}</Text>
            <Text style={styles.tableCol}>{student.faculty}</Text>
            <Text style={styles.tableCol}>{student.major}</Text>
            <Text style={styles.tableCol}>{student.note}</Text>
          </View>
        ))} */}
      </View>
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
