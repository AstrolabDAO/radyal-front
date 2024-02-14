import { useEffect, useState } from "react";

export const useIsMobile = () => {
  // État pour stocker si l'affichage est mobile
  const [isMobile, setIsMobile] = useState(false);

  // Effectuer une mise à jour lors du montage et du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      // Définir isMobile à true si la largeur de la fenêtre est < 768 pixels
      setIsMobile(window.innerWidth < 768);
    };

    // Appeler une fois au montage pour initialiser l'état correctement
    handleResize();

    // Ajouter un écouteur d'événement pour les changements de taille de fenêtre
    window.addEventListener("resize", handleResize);

    // Nettoyer en enlevant l'écouteur d'événement lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'au montage et au démontage

  return isMobile;
};
