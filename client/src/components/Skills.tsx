import React, { useState } from 'react';
import { Sparkles, Plus, Brain, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { SkillsRadarChart } from './questionnaire/RadarChart';

interface SkillsProps {
  employeeData?: any;
}

export const Skills: React.FC<SkillsProps> = ({ employeeData }) => {
  const employee = employeeData;
  const [softSkillsExpanded, setSoftSkillsExpanded] = useState(false);
  const [hardSkillsExpanded, setHardSkillsExpanded] = useState(false);

  const softSkills = employee?.structured_employees?.soft_skills || [];
  const visibleSoftSkills = softSkillsExpanded ? softSkills : softSkills.slice(0, 5);
  const hasMoreSoftSkills = softSkills.length > 5;

  const hardSkills = employee?.structured_employees?.hard_skills || [];
  const visibleHardSkills = hardSkillsExpanded ? hardSkills : hardSkills.slice(0, 5);
  const hasMoreHardSkills = hardSkills.length > 5;

  // Prepare data for radar chart - use soft skills
  const softSkillLabels = softSkills.map((skill: any) => skill.skill);
  const softSkillScores = softSkills.map((skill: any) => skill.level);

  return (
    <section id="skills-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          מיומנויות
        </h2>
        {/* <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
          <Plus className="w-3 h-3" />
          הוסף מיומנות
        </button> */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-accent/5 p-6 rounded-card border-2 border-accent/20"
          style={{ paddingBottom: "0rem" }}>
          <div className="flex items-center gap-3 mb-5">
            <Brain className="text-accent-dark w-6 h-6" />
            <h3 className="text-xl font-bold text-accent-dark">מיומנויות אישיות</h3>
          </div>

          <div>
            {/* Radar Chart for Soft Skills */}
            {softSkillLabels.length > 0 && (
              <div className="flex justify-center">
                <div style={{ width: "400px", height: "400px" }}>
                  <SkillsRadarChart
                    labels={softSkillLabels}
                    myScores={softSkillScores}
                    backgroundColor="rgba(139, 92, 246, 0.25)"
                    borderColor="rgba(139, 92, 246, 0.8)"
                    pointColor="rgba(139, 92, 246, 0.8)"
                    gridColor="rgba(139, 92, 246, 0.12)"
                  />
                </div>
              </div>
            )}


            {/* {visibleSoftSkills.map((skill: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neutral-dark">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-medium">רמה:</span>
                    <span className="font-bold text-accent-dark">{skill.level}/5</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-2.5">
                  <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: `${skill.level * 20}%` }}></div>
                </div>
              </div>
            ))}

            {hasMoreSoftSkills && (
              <button
                onClick={() => setSoftSkillsExpanded(!softSkillsExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-sm font-semibold text-accent-dark hover:bg-accent/10 rounded-lg transition-colors"
              >
                {softSkillsExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    הצג פחות
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    הצג עוד {softSkills.length - 5} מיומנויות
                  </>
                )}
              </button>
            )} */}

            {/* <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">מנהיגות</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">4/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">קליטה מהירה</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">למידה עצמית</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">חשיבה אנליטית</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">4/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">פתרון בעיות</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-accent-dark">5/5</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-accent-dark h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-card border-2 border-primary/20">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Code className="text-primary w-6 h-6" />
              <h3 className="text-xl font-bold text-primary">מיומנויות תפקיד</h3>
            </div>
            <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-2">
              <Plus className="w-3 h-3" />
              הוסף מיומנות
            </button>
          </div>

          <div className="space-y-4">
            {visibleHardSkills.map((skill: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-neutral-dark">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-medium">רמה:</span>
                    <span className="font-bold text-primary">{skill.level}/5</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.level * 20}%` }}></div>
                </div>
              </div>
            ))}

            {hasMoreHardSkills && (
              <button
                onClick={() => setHardSkillsExpanded(!hardSkillsExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                {hardSkillsExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    הצג פחות
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    הצג עוד {hardSkills.length - 5} מיומנויות
                  </>
                )}
              </button>
            )}
            {/* <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Java & Spring Boot</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">5/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מומחה</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Microservices Architecture</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">4/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מתקדם</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">REST API Design</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">5/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מומחה</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">SQL & Database Design</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">4/5</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill">מתקדם</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Docker & Kubernetes</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">3/5</span>
                  <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded-pill">בינוני</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-status-warning h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-dark">Cloud Infrastructure (AWS)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-medium">רמה:</span>
                  <span className="font-bold text-primary">2/5</span>
                  <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded-pill">בסיסי</span>
                </div>
              </div>
              <div className="w-full bg-neutral-light rounded-full h-2.5">
                <div className="bg-status-warning h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};
