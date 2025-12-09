import React, { useState } from 'react';
import { Heart, Plus, MessageCircle, Briefcase, Tags, Bell, Pen, Trash, Lightbulb, X, Check } from 'lucide-react';

export const Wishlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishType, setWishType] = useState('text');
  const [keywords, setKeywords] = useState(['ניהול', 'הובלה']);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  return (
    <section id="wishlist-section" className="bg-white p-8 rounded-card shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <Heart className="w-6 h-6" />
          רשימת המשאלות שלי
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-card font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          הוסף משאלה
        </button>
      </div>

      <div className="space-y-4" id="wishlist-container">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-5 rounded-card border-2 border-primary/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-primary w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-pill font-semibold">טקסט חופשי</span>
                  <span className="text-xs text-neutral-medium">נוסף לפני 5 ימים</span>
                </div>
                <p className="text-neutral-dark font-medium leading-relaxed">אני מעוניינת להתפתח לכיוון הובלה טכנית של צוותים, עם דגש על ארכיטקטורת Cloud ומערכות מבוזרות. מחפשת הזדמנות להוביל פרויקטים משמעותיים עם השפעה ארגונית.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-primary hover:bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Pen className="w-4 h-4" />
              </button>
              <button className="text-status-danger hover:bg-status-danger/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent/5 to-primary/5 p-5 rounded-card border-2 border-accent/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="text-accent-dark w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-accent/20 text-accent-dark px-2 py-1 rounded-pill font-semibold">תפקיד ספציפי</span>
                  <span className="text-xs bg-status-warning/20 text-status-warning px-2 py-1 rounded-pill font-semibold flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    התראה פעילה
                  </span>
                  <span className="text-xs text-neutral-medium">נוסף לפני שבועיים</span>
                </div>
                <h4 className="font-bold text-accent-dark mb-1">ראש צוות פיתוח Backend</h4>
                <p className="text-sm text-neutral-medium mb-2">חטיבת טכנולוגיות • מחלקת פיתוח</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-status-danger/20 text-status-danger px-2 py-1 rounded-pill font-semibold">לא פתוח כרגע</span>
                  <span className="text-xs text-neutral-medium">תקבלי התראה כשהמשרה תפתח</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-accent-dark hover:bg-accent/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Pen className="w-4 h-4" />
              </button>
              <button className="text-status-danger hover:bg-status-danger/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary/5 to-accent/5 p-5 rounded-card border-2 border-secondary/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Tags className="text-secondary w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-pill font-semibold">מילות מפתח</span>
                  <span className="text-xs bg-status-success/20 text-status-success px-2 py-1 rounded-pill font-semibold flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    התראה פעילה
                  </span>
                  <span className="text-xs text-neutral-medium">נוסף לפני חודש</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-semibold border border-primary/30">ניהול</span>
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-semibold border border-primary/30">הובלה טכנית</span>
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-semibold border border-primary/30">ארכיטקטורה</span>
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-semibold border border-primary/30">Cloud</span>
                </div>
                <p className="text-xs text-neutral-medium mt-3">תקבלי התראה על משרות המכילות את מילות המפתח הללו</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-secondary hover:bg-secondary/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Pen className="w-4 h-4" />
              </button>
              <button className="text-status-danger hover:bg-status-danger/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-accent/10 rounded-card border border-accent/30">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-accent-dark w-6 h-6" />
          <div>
            <p className="text-sm font-semibold text-accent-dark mb-1">טיפ: ניהול רשימת המשאלות</p>
            <p className="text-xs text-neutral-dark">הוסיפי משאלות כדי לקבל התראות אוטומטיות על משרות מתאימות. ניתן לערוך או למחוק משאלות בכל עת.</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-light">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  הוספת משאלה חדשה
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-medium hover:text-neutral-dark w-8 h-8 rounded-full hover:bg-neutral-light flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="text-sm font-semibold text-neutral-dark mb-3 block">בחרי סוג משאלה</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setWishType('text')} 
                    className={`p-4 border-2 rounded-card hover:bg-primary/5 transition-all text-center ${wishType === 'text' ? 'border-primary bg-primary/5' : 'border-neutral-light hover:border-primary'}`}
                  >
                    <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${wishType === 'text' ? 'text-primary' : 'text-neutral-medium'}`} />
                    <p className="font-semibold text-sm text-neutral-dark">טקסט חופשי</p>
                  </button>
                  <button 
                    onClick={() => setWishType('role')} 
                    className={`p-4 border-2 rounded-card hover:bg-accent/5 transition-all text-center ${wishType === 'role' ? 'border-accent bg-accent/5' : 'border-neutral-light hover:border-accent'}`}
                  >
                    <Briefcase className={`w-8 h-8 mx-auto mb-2 ${wishType === 'role' ? 'text-accent-dark' : 'text-neutral-medium'}`} />
                    <p className="font-semibold text-sm text-neutral-dark">תפקיד ספציפי</p>
                  </button>
                  <button 
                    onClick={() => setWishType('keywords')} 
                    className={`p-4 border-2 rounded-card hover:bg-secondary/5 transition-all text-center ${wishType === 'keywords' ? 'border-secondary bg-secondary/5' : 'border-neutral-light hover:border-secondary'}`}
                  >
                    <Tags className={`w-8 h-8 mx-auto mb-2 ${wishType === 'keywords' ? 'text-secondary' : 'text-neutral-medium'}`} />
                    <p className="font-semibold text-sm text-neutral-dark">מילות מפתח</p>
                  </button>
                </div>
              </div>

              {wishType === 'text' && (
                <div>
                  <label className="text-sm font-semibold text-neutral-dark mb-2 block">תארי את המשאלה שלך</label>
                  <textarea className="w-full border-2 border-neutral-light rounded-card p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[120px]" placeholder="לדוגמה: אני מעוניינת להתפתח לכיוון ניהול פרויקטים..."></textarea>
                  <p className="text-xs text-neutral-medium mt-2">שתפי את הרצונות והשאיפות שלך בצורה חופשית</p>
                </div>
              )}

              {wishType === 'role' && (
                <div>
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-neutral-dark mb-2 block">בחרי תפקיד</label>
                    <select className="w-full border-2 border-neutral-light rounded-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>בחרי תפקיד מהרשימה...</option>
                      <option>ראש צוות פיתוח Backend</option>
                      <option>ארכיטקט תוכנה בכיר</option>
                      <option>מנהל/ת מוצר טכני</option>
                      <option>Tech Lead</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-accent/10 rounded-card border border-accent/20">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary" />
                    <span className="text-sm font-semibold text-neutral-dark">שלחי לי התראה כשהמשרה תפתח</span>
                  </label>
                </div>
              )}

              {wishType === 'keywords' && (
                <div>
                  <label className="text-sm font-semibold text-neutral-dark mb-2 block">הוסיפי מילות מפתח</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      placeholder="הקלידי מילת מפתח..." 
                      className="flex-1 border-2 border-neutral-light rounded-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                    />
                    <button onClick={addKeyword} className="bg-primary text-white px-5 py-3 rounded-card font-semibold hover:bg-primary-dark transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-3 bg-neutral-extralight rounded-card border-2 border-dashed border-neutral-light">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-semibold border border-primary/30 flex items-center gap-2">
                        {keyword}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-primary-dark" 
                          onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                        />
                      </span>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-secondary/10 rounded-card border border-secondary/20">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary" />
                    <span className="text-sm font-semibold text-neutral-dark">שלחי לי התראה על משרות עם מילות המפתח הללו</span>
                  </label>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-light flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 border-2 border-neutral-light text-neutral-dark rounded-card font-semibold hover:bg-neutral-light transition-colors">
                ביטול
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-primary text-white rounded-card font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Check className="w-4 h-4" />
                שמור משאלה
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
