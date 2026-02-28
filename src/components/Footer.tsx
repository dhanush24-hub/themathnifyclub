import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              <span className="gradient-text">THE MATHnify</span> CLUB
            </h3>
            <p className="text-sm text-white/60">
              Official student-led wing under the Career Development Center (CDC) of
              Narsimha Reddy Engineering College, Maisammaguda, Secunderabad, Telangana.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/90 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {['/', '/about', '/programs', '/patrons-mentors', '/club-leads', '/departments', '/gallery', '/contact', '/join'].map((href, i) => {
                const labels = ['Home', 'About', 'Programs', 'Patrons & Mentors', 'Club Leads', 'Departments', 'Gallery', 'Contact', 'Join'];
                return (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/60 hover:text-indigo-400 transition-colors">
                      {labels[i]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/90 mb-3">Contact</h4>
            <p className="text-sm text-white/60">Narsimha Reddy Engineering College</p>
            <p className="text-sm text-white/60">Maisammaguda, Secunderabad, Telangana</p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          © {new Date().getFullYear()} THE MATHnify CLUB — NRCM CDC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
