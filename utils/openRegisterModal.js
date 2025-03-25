export const openRegisterModal = () => {
  const bootstrap = require("bootstrap"); // dynamically import bootstrap
  
  // Đóng bất kỳ modal nào đang mở
  const modalElements = document.querySelectorAll(".modal.show");
  modalElements.forEach((modal) => {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  });

  // Đóng bất kỳ offcanvas nào đang mở
  const offcanvasElements = document.querySelectorAll(".offcanvas.show");
  offcanvasElements.forEach((offcanvas) => {
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
  
  // Mở register modal
  var registerModal = new bootstrap.Modal(document.getElementById("register"), {
    keyboard: false,
  });

  registerModal.show();
  
  // Thêm listener để xử lý khi modal đóng
  document
    .getElementById("register")
    .addEventListener("hidden.bs.modal", () => {
      registerModal.hide();
    });
}; 