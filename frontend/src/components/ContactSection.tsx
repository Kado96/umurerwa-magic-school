import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-5xl text-center text-foreground mb-4">
          Contactez-nous 📬
        </h2>
        <p className="text-center text-muted-foreground font-body text-lg max-w-2xl mx-auto mb-12">
          Nous serions ravis de vous accueillir ! N'hésitez pas à nous contacter pour toute question.
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Adresse</h3>
                <p className="font-body text-muted-foreground">Bujumbura, Burundi</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-letter-green/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-letter-green" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Téléphone</h3>
                <p className="font-body text-muted-foreground">+257 XX XXX XXX</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-letter-blue/10 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-letter-blue" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Email</h3>
                <p className="font-body text-muted-foreground">info@umurerwaschool.bi</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-letter-amber" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Horaires</h3>
                <p className="font-body text-muted-foreground">Lun - Ven : 7h30 - 16h30</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-body font-bold text-sm text-foreground mb-1 block">Nom complet</label>
              <input
                type="text"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="font-body font-bold text-sm text-foreground mb-1 block">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="font-body font-bold text-sm text-foreground mb-1 block">Message</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                placeholder="Votre message..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-display py-3 rounded-full text-lg hover:scale-[1.02] transition-transform shadow-md"
            >
              Envoyer 🚀
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
