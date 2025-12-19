import { Linkedin, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">SolveBridge Africa</h3>
            <p className="text-background/80">
              Bridging real problems to real solutions across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="/about" className="hover:text-background transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/programs" className="hover:text-background transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="/impact" className="hover:text-background transition-colors">
                  Impact
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-background transition-colors">
                  Team
                </a>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="/submit-problem" className="hover:text-background transition-colors">
                  Submit a Problem
                </a>
              </li>
              <li>
                <a href="/auth" className="hover:text-background transition-colors">
                  Join as Innovator
                </a>
              </li>
              <li>
                <a href="/partners" className="hover:text-background transition-colors">
                  Become a Partner
                </a>
              </li>
              <li>
                <a href="/get-involved" className="hover:text-background transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-background/80">
              <li>Nairobi, Kenya</li>
              <li>solvebridgeafrica@gmail.com</li>
              <li>+254 702660246</li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-background/80 text-sm">
            © {new Date().getFullYear()} SolveBridge Africa. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/solvebridgeafrica/about/?viewAsMember=true"
              className="bg-background/10 p-2 rounded-full hover:bg-background/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com/SolveBridge_Afr"
              className="bg-background/10 p-2 rounded-full hover:bg-background/20 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://www.facebook.com/share/19nbXi8mpp/"
              className="bg-background/10 p-2 rounded-full hover:bg-background/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
