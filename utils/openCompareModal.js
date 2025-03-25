export const openCompareModal = () => {
  if (typeof window !== 'undefined') {
    // Only run on client side
    import('bootstrap').then(bootstrap => {
      // Close any open modals
      const modalElements = document.querySelectorAll(".modal.show");
      modalElements.forEach((modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
      
      // Close any open offcanvas
      const offcanvasElements = document.querySelectorAll(".offcanvas.show");
      offcanvasElements.forEach((offcanvas) => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      });
      
      // Open the compare modal
      const compareElement = document.getElementById("compare");
      if (compareElement) {
        // Create a new Offcanvas instance
        const offcanvasCompare = new bootstrap.Offcanvas(compareElement);
        
        // Open the offcanvas
        offcanvasCompare.show();
      }
    });
  }
}; 