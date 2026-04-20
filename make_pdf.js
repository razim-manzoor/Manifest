
import { jsPDF } from "jspdf";
import fs from "fs";

const doc = new jsPDF();
doc.text("John Doe Experience: Agentic AI Engineer", 10, 10);
doc.save("test_resume.pdf");
console.log("PDF generated");
