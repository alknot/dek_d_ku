import axios from "axios";

class ApiService {
  constructor() {
    axios.defaults.baseURL = "http://localhost:3000/api";
  }

  async requestApprove(id: string, isApproved: boolean) {
    await axios.post(`/request/approve/${id}`, { isApproved });
  }

  async uploadTermPrice(parsedData: any[], academicYear: string, term: string) {

    const dataWithMetadata = parsedData.map((row) => ({
        ...row,
        academicYear,
        term,
      }));

    const mappedData = dataWithMetadata.map((row: any) => ({
      academicYear: academicYear,
      term: term,
      department: row["ภาควิชา"],
      faculty: row["คณะ"],
      price1: parseFloat(row["ค่าธรรมเนียมคณะ"]),
      price2: parseFloat(row["ค่าบำรุงมหาวิทยาลัย"]),
      price3: parseFloat(row["ค่าหน่วยกิต"]),
      programType: row["โปรแกรมการเรียน"],
      study: row["รูปแบบภาคการเรียน"],
      sumPrice: parseFloat(row["รวม"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    console.log("Mapped data:", mappedData);
    try {
      await Promise.all(
        mappedData.map((mappedData) => axios.post("/termprice", mappedData))
      );
      alert("อัปโหลดข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดข้อมูล");
    }
  }

  async fetchData(academicYear: string, term: string) {
    // ตรวจสอบให้แน่ใจว่า academicYear และ term มีค่า
    if (academicYear && term) {
      try {
        const response = await axios.get("/termprice", {
          params: { academicYear, term },
        });
        return response.data;
      } catch (err) {
        console.error("Failed to fetch data. Please try again.", err);
        throw err;
      }
    } else {
      throw new Error("academicYear and term are required");
    }
  }


}

export const apiService = new ApiService();