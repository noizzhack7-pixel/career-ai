import React from 'react';
import { GraduationCap, Plus, University, Award, Pencil } from 'lucide-react';

interface EducationProps {
  employeeData: any;
}

export const Education: React.FC<EducationProps> = ({ employeeData }) => {
  const employee = employeeData;
  return (
    <section id="education-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <GraduationCap className="w-6 h-6" />
          השכלה והסמכות
        </h2>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
            <Pencil className="w-3 h-3" />
            ערוך
          </button>
          <div className="h-4 w-px bg-neutral-light"></div>
          <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
            <Plus className="w-3 h-3" />
            הוסף
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {employee.first_degree && employee.first_degree !== 'אין' && (
          <div className="border-r-4 border-primary bg-primary/5 p-6 rounded-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                  <University className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{employee.first_degree}</h3>
                  <p className="text-neutral-dark font-semibold">אוניברסיטת תל אביב</p>
                  <p className="text-sm text-neutral-medium">2015 - 2018</p>
                </div>
              </div>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-bold">תואר אקדמי</span>
            </div>
          </div>
        )}

        {employee.second_degree && employee.second_degree !== 'אין' && (
          <div className="border-r-4 border-primary bg-primary/5 p-6 rounded-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                  <University className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{employee.second_degree}</h3>
                  <p className="text-neutral-dark font-semibold">{employee.second_degree_university}</p>
                  <p className="text-sm text-neutral-medium">2018 - 2021</p>
                </div>
              </div>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-bold">תואר אקדמי</span>
            </div>
          </div>
        )}

        {/* <div className="border-r-4 border-primary bg-primary/5 p-6 rounded-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                <University className="text-primary w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">תואר ראשון במדעי המחשב (B.Sc.)</h3>
                <p className="text-neutral-dark font-semibold">אוניברסיטת תל אביב</p>
                <p className="text-sm text-neutral-medium">2015 - 2018</p>
              </div>
            </div>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-pill text-xs font-bold">תואר אקדמי</span>
          </div>
          <p className="text-sm text-neutral-dark">התמחות בפיתוח תוכנה וארכיטקטורת מערכות. פרויקט גמר בנושא Microservices.</p>
        </div> */}

        {employee.certification_courses && employee.certification_courses.split(',').map((course: string, index: React.Key | null | undefined) => (
          <div key={index} className="border-r-4 border-status-success bg-status-success/5 p-6 rounded-card mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                  <Award className="text-status-success w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-status-success">{course}</h3>
                  <p className="text-neutral-dark font-semibold">ג'ון ברייס</p>
                  <p className="text-sm text-neutral-medium">2024</p>
                </div>
              </div>
              <span className="bg-status-success/20 text-status-success px-3 py-1 rounded-pill text-xs font-bold">הסמכה</span>
            </div>
          </div>
        ))}


        {/* <div className="border-r-4 border-status-success bg-status-success/5 p-6 rounded-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                <Award className="text-status-success w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-status-success">Certified Scrum Master (CSM)</h3>
                <p className="text-neutral-dark font-semibold">Scrum Alliance</p>
                <p className="text-sm text-neutral-medium">2024</p>
              </div>
            </div>
            <span className="bg-status-success/20 text-status-success px-3 py-1 rounded-pill text-xs font-bold">הסמכה</span>
          </div>
          <p className="text-sm text-neutral-dark">הסמכה בניהול פרויקטים לפי מתודולוגיית Agile/Scrum.</p>
        </div> */}

        {employee.external_courses && employee.external_courses.split(',').map((course: string, index: any) => (
          <div key={index} className="border-r-4 border-status-success bg-status-success/5 p-6 rounded-card mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                  <Award className="text-accent-dark w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-accent-dark">{course}</h3>
                  <p className="text-neutral-dark font-semibold">{index % 2 === 0 ? 'Udemy' : 'Coursera'}</p>
                  <p className="text-sm text-neutral-medium">{index % 2 === 0 ? 2019 : 2020}</p>
                </div>
              </div>
              <span className="bg-accent/30 text-accent-dark px-3 py-1 rounded-pill text-xs font-bold">הסמכה</span>
            </div>
            {/* <p className="text-sm text-neutral-dark">הסמכה מקצועית בפיתוח Java ברמה מתקדמת.</p> */}
          </div>
        ))}

        {/* <div className="border-r-4 border-accent bg-accent/5 p-6 rounded-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                <Award className="text-accent-dark w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-accent-dark">Oracle Certified Professional - Java SE</h3>
                <p className="text-neutral-dark font-semibold">Oracle</p>
                <p className="text-sm text-neutral-medium">2019</p>
              </div>
            </div>
            <span className="bg-accent/30 text-accent-dark px-3 py-1 rounded-pill text-xs font-bold">הסמכה</span>
          </div>
          <p className="text-sm text-neutral-dark">הסמכה מקצועית בפיתוח Java ברמה מתקדמת.</p>
        </div>

        <div className="border-r-4 border-accent bg-accent/5 p-6 rounded-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-card">
                <Award className="text-accent-dark w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-accent-dark">Spring Professional Certification</h3>
                <p className="text-neutral-dark font-semibold">Pivotal (VMware)</p>
                <p className="text-sm text-neutral-medium">2020</p>
              </div>
            </div>
            <span className="bg-accent/30 text-accent-dark px-3 py-1 rounded-pill text-xs font-bold">הסמכה</span>
          </div>
          <p className="text-sm text-neutral-dark">הסמכה מקצועית ב-Spring Framework ו-Spring Boot.</p>
        </div> */}


      </div>
    </section>
  );
};