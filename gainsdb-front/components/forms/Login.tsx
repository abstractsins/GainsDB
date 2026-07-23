import { CredentialsFormData } from "@/constants/formConstants";

import styles from "@/components/LoginRegister.module.css";

interface Props {
  formData: CredentialsFormData;
  setFormData: (formData: CredentialsFormData) => void;
}

export default function Login({ formData, setFormData }: Props) {
  return (
    <div className={`${styles.loginFieldsContainer}`}>
      <input
        // ref={usernameRef}
        className={`${styles.loginField}`}
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) =>
          setFormData({ ...formData, username: e.target.value.trim() })
        }
        required
      />
      <input
        className={`${styles.loginField}`}
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value.trim() })
        }
        required
      />
    </div>
  );
}
