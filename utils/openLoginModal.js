export const openLoginModal = () => {
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
  
  // Mở login modal
  var loginModal = new bootstrap.Modal(document.getElementById("login"), {
    keyboard: false,
  });

  loginModal.show();
  
  // Thêm listener để xử lý khi modal đóng
  document
    .getElementById("login")
    .addEventListener("hidden.bs.modal", () => {
      loginModal.hide();
    });
};
