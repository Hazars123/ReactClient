import React from 'react';
import Layout from './layout'

const about = () => {
  // Styles CSS-in-JS
  const styles = {
    aboutContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Arial', sans-serif",
      color: '#333',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#7f8c8d',
      fontWeight: '300',
    },
    content: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '30px',
    },
    section: {
      flex: '1',
      minWidth: '300px',
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#3498db',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '2px solid #eee',
    },
    paragraph: {
      lineHeight: '1.6',
      marginBottom: '15px',
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    teamMember: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    memberImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '15px',
      border: '3px solid #3498db',
    },
    memberName: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    memberRole: {
      color: '#7f8c8d',
      fontStyle: 'italic',
    },
  };

  return (
    <Layout>
      <br /><br />
    <div style={styles.aboutContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>À propos de nous</h1>
        <p style={styles.subtitle}>Découvrez notre histoire, notre mission et notre équipe</p>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Notre histoire</h2>
          <p style={styles.paragraph}>
            Fondée en 2010, notre entreprise a commencé comme un petit projet entre amis passionnés par la technologie.
            Aujourd'hui, nous sommes une équipe de plus de 50 professionnels dédiés à fournir les meilleures solutions
            pour nos clients.
          </p>
          <p style={styles.paragraph}>
            Notre croissance a été guidée par nos valeurs fondamentales : l'innovation, la qualité et le service client.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Notre mission</h2>
          <p style={styles.paragraph}>
            Nous croyons que la technologie devrait simplifier la vie des gens. Notre mission est de créer des produits
            intuitifs, performants et accessibles à tous.
          </p>
          <p style={styles.paragraph}>
            Chaque jour, nous travaillons à repousser les limites de ce qui est possible tout en gardant une approche
            humaine et centrée sur l'utilisateur.
          </p>
        </section>
      </div>

      <section style={{ ...styles.section, width: '100%' }}>
        <h2 style={styles.sectionTitle}>Notre équipe</h2>
        <div style={styles.teamGrid}>
          {[1, 2, 3, 4].map((member) => (
            <div key={member} style={styles.teamMember}>
              <img
                src={`https://randomuser.me/api/portraits/${member % 2 === 0 ? 'women' : 'men'}/${member}.jpg`}
                alt={`Membre d'équipe ${member}`}
                style={styles.memberImage}
              />
              <h3 style={styles.memberName}>Prénom Nom {member}</h3>
              <p style={styles.memberRole}>
                {member === 1 && 'CEO'}
                {member === 2 && 'Développeuse Frontend'}
                {member === 3 && 'Designer UX/UI'}
                {member === 4 && 'Responsable Marketing'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default about;