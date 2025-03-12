import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create()(
  persist(
    (set) => ({
      isLoggedIn: false,
      UserName: "",
      Email: "",
      AvatarUrl: "",
      Role: "",
      // accessToken="",
      setLoggedIn: (accessToken) => {
        let data = jwtDecode(accessToken);
        set({
          isLoggedIn: true,
          UserName: data.UserName,
          Email: data.Email,
          AvatarUrl: data.AvatarUrl,
          Role: data[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
        });
      },
      setLoggedOut: () => {
        set({
          isLoggedIn: false,
          UserName: "",
          Email: "",
          AvatarUrl: "",
          Role: "",
        });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
