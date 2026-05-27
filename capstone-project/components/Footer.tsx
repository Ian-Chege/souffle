export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-foot">
      <div className="container foot-grid">
        <p className="foot-statement">
          Rare lamps, found, conserved, rewired and quietly kept until the
          right room comes for them.
        </p>
        <div className="foot-meta">
          <span>Souffle</span>
          <span>Nairobi · Kenya</span>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
