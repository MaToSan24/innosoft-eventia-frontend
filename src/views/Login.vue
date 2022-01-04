<template>
  
  <Toast />

  <div class="grid" style="justify-content: center;">
    <div class="col-3">
			<div class="card">
				<h2>Login</h2>

				<div class="p-fluid formgrid grid">
					<div class="field col-12 md:col-10">
						<label for="usernameId">Username</label>
            <InputText v-model="username" name="username" id="usernamedId" @keypress.enter="signIn()" />
					</div>
        </div>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-10">
						<label for="usernameId">Password</label>
            <Password v-model="password" name="password" id="passwordId" @keypress.enter="signIn()" />
					</div>
        </div>
        <div class="grid">
          <Button type="button" icon="pi pi-check" label="Sign Up" class="p-button-info mt-4" @click="signIn()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import axios from "axios";
import Toast from 'primevue/toast';

export default {
  name: 'Login',
  components: {
    InputText,
    Password,
    Button,
    Toast,
  },
  data() {
    return {
        username: this.$store.state.username,
        password: this.$store.state.password
    }
  },
  methods: {
    created(){
      this.signIn();
    },
    signIn() {
      this.$store.dispatch("saveUsername", this.username);
      this.$store.dispatch("savePassword", this.password);
      
        axios.get('/peticionesPublicacion', {
          auth : {
              username: this.$store.state.username,
              password: this.$store.state.password
          }
        })
        .then(resp => {
          console.log(resp.data);
          window.location.href = '/'
          this.$toast.add({severity:'success', summary: 'Successful', detail: 'Logged in successfully', life: 3000});
        }).catch(err => {
          console.log(err);
          if (this.username !== "" && this.password !== "")
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Incorrect user and password', life: 3000});
        })    
    }
  }
}
</script>

<style scoped>

.grid {
  justify-content: center;
}
</style>
