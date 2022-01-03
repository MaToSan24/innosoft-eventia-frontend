<template>
	<div class="grid">

		<div style="width: 100%; display: flex; justify-content: center;">
			<div class="card col-6" style="display: flex; justify-content: space-evenly">
				<img v-if="LogoEventia" :src="LogoEventia" width="100"/>
				<h1 style="font-size: 4rem">
					Innosoft Eventia
				</h1>
			</div>
		</div>

		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Crear" icon="pi pi-plus" class="p-button-success mr-2" @click="crearPeticionPublicacion" />
							<Button label="Borrar" icon="pi pi-trash" class="p-button-danger" @click="confirmBorrarSelected" :disabled="!selectedPeticionesPublicacion || !selectedPeticionesPublicacion.length" />
						</div>
					</template>
					<template v-slot:end>
						<Button label="Actualizar base de datos" icon="pi pi-plus" class="mr-2 inline-block" @click="actualizarBD"/>
						<Button label="Exportar CSV" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="peticionesPublicacion" v-model:selection="selectedPeticionesPublicacion" dataKey="_id" 
				:paginator="true" :rows="10" :filters="filters" :rowsPerPageOptions="[5,10,25]" responsiveLayout="scroll"
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Mostrando de {first} a {last} de un total de {totalRecords} peticiones">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Peticiones de publicación de eventos</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem" />
					<Column field="idEvento" header="ID del evento" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">ID del evento</span>
							{{slotProps.data.idEvento}}
						</template>
					</Column>
					<Column field="titulo" header="Título" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Título</span>
							{{slotProps.data.titulo}}
						</template>
					</Column>
					<Column field="descripcion" header="Descripción" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Descripción</span>
							{{slotProps.data.descripcion}}
						</template>
					</Column>
					<Column field="inicio" header="Inicio" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Inicio</span>
							{{new Date(slotProps.data.inicio).toLocaleString()}}
						</template>
					</Column>
					<Column field="fin" header="Fin" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Fin</span>
							{{new Date(slotProps.data.fin).toLocaleString()}}
						</template>
					</Column>
					<Column field="imagen" header="Imagen">
						<template #body="slotProps">
							<span class="p-column-title">Imagen</span>
							<img v-if="slotProps.data.imagen" :src="slotProps.data.imagen" class="shadow-2" width="100" />
						</template>
					</Column>
					<Column field="actions" header="Acciones">
						<template #body="slotProps">
							<div style="display: flex">
								<Button icon="pi pi-pencil" class="p-button-rounded p-button-primary mr-2" @click="editarPeticionPublicacion(slotProps.data)" />
								<Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2" @click="confirmarBorrarPeticionPublicacion(slotProps.data)" />
								<Button icon="pi pi-twitter" :class="slotProps.data.publicadoTwitter ? 'p-button-rounded p-button-success mr-2 p-disabled' 
								: 'p-button-rounded p-button-warning mr-2'" @click="openDisplayTwitter(slotProps.data)" />
								<Button icon="pi pi-telegram" :class="slotProps.data.publicadoTelegram ? 'p-button-rounded p-button-success mr-2' 
								: 'p-button-rounded p-button-warning mr-2'" @click="openDisplayTelegram(slotProps.data)" />
							</div>
							<div>
								<Button icon="pi pi-facebook" :class="slotProps.data.publicadoFacebook ? 'p-button-rounded p-button-success mr-2 p-disabled' 
								: 'p-button-rounded p-button-warning mr-2'" @click="confirmarPublicacionFacebook(slotProps.data)"/>
                                <Button icon="pi pi-at" class="p-button-rounded p-button-warning mt-2" @click="publicarEnGmail(slotProps.data)" />
							</div>
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="peticionPublicacionDialog" header="Peticion de publicacion" :modal="true" class="p-fluid col-3">
					<div class="field">
						<label for="titulo">Título</label>
						<InputText id="titulo" v-model.trim="peticionPublicacion.titulo" required="true" autofocus :class="{'p-invalid': submitted && !peticionPublicacion.titulo}" />
						<small class="p-invalid" v-if="submitted && !peticionPublicacion.titulo">El título es obligatorio.</small>
					</div>
					<div class="field">
						<label for="descripcion">Descripcion</label>
						<Textarea id="descripcion" v-model="peticionPublicacion.descripcion" required="true" rows="3" cols="20" />
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="fechaInicio">Fecha inicio</label>
							<Calendar id="fechaInicio" v-model="peticionPublicacion.inicio" :showTime="true" :showSeconds="true" :showIcon="true" required="true" autofocus :class="{'p-invalid': submitted && !peticionPublicacion.inicio}" />
							<small class="p-invalid" v-if="submitted && !peticionPublicacion.inicio">La fecha de inicio es obligatoria.</small>
						</div>
						<div class="field col">
							<label for="fechaFin">Fecha fin</label>
							<Calendar id="fechaFin" v-model="peticionPublicacion.fin" :showTime="true" :showSeconds="true" :showIcon="true" required="true" autofocus :class="{'p-invalid': submitted && !peticionPublicacion.fin}" />
							<small class="p-invalid" v-if="submitted && !peticionPublicacion.fin">La fecha de fin es obligatoria.</small>
						</div>
					</div>
					<div class="field">
						<label for="imagen">URL de la imagen</label>
						<InputText id="imagen" v-model.trim="peticionPublicacion.imagen"/>
						<img :src="peticionPublicacion.imagen" :alt="peticionPublicacion.imagen" v-if="peticionPublicacion.imagen" 
						width="250" class="mt-5 mx-auto mb-2 block shadow-2" />
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-text p-button-danger" @click="hideDialog"/>
						<Button label="Actualizar" icon="pi pi-check" class="p-button-text" @click="actualizarPeticionPublicacion" />
					</template>
				</Dialog>

				<Dialog v-model:visible="borrarPeticionPublicacionDialog" class="col-3" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="peticionPublicacion">¿Estás seguro de que deseas borrar el evento: "<b>{{peticionPublicacion.titulo}}</b>"?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="borrarPeticionPublicacionDialog = false"/>
						<Button label="Sí" icon="pi pi-check" class="p-button-text" @click="borrarPeticionPublicacion" />
					</template>
				</Dialog>

				<Dialog v-model:visible="borrarPeticionesPublicacionDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="peticionPublicacion">¿Estás seguro de que deseas borrar las peticiones de publicación seleccionadas?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="borrarPeticionesPublicacionDialog = false"/>
						<Button label="Sí" icon="pi pi-check" class="p-button-text" @click="borrarSelectedPeticionesPublicacion" />
					</template>
				</Dialog>

				<Dialog v-model:visible="confirmarPublicacionFB" class="p-fluid col-3" header="Detalles de la publicación" :modal="true">
					<div class="p-fluid formgrid grid" style="justify-content: center">
						<div class="field mb-3 col-12 md:col-12">
							<label for="fbText">Cuerpo de la publicación</label>
							<Textarea id="fbText" v-model="fbText" required="true" :class="{'p-invalid': submitted && !fbText}" rows="10"/>
							<small class="p-invalid" v-if="submitted && !fbText">Este campo es obligatorio.</small>
						</div>
						<div class="field mb-3 col-12 md:col-12">
							<label for="imagen">Imagen</label>
							<InputText id="imagen" v-model="peticionParaPublicarConFacebook.imagen" required="false" rows="3" cols="20" />
						</div>
						<div class="field mb-3 col-12 md:col-12 text-center">
							<img v-if="peticionParaPublicarConFacebook.imagen" :src="peticionParaPublicarConFacebook.imagen" class="shadow-2" width="250" />
							<p v-else class="line-height-3 m-0">Sin imagen</p>
						</div>
					</div>	
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-text p-button-danger" @click="cancelarPublicarFacebook"/>
						<Button label="Publicar" icon="pi pi-check" class="p-button-text" @click="publicarEnFacebook" autofocus />
					</template>
				</Dialog>
        
				<Dialog header="Publicar en Twitter" v-model:visible="displayTwitter" class="col-3" :modal="true">
					<div class="p-fluid formgrid grid" style="text-align: center; justify-content: center">
						<Panel header="Título" class="mb-3 col-12 md:col-12">
							<p class="line-height-3 m-0">{{peticionParaPublicarConTwitter.titulo}}</p>
						</Panel>
						<Panel header="Fecha inicio" class="mb-3 col-12 md:col-6">
							<p class="line-height-3 m-0">{{new Date(peticionParaPublicarConTwitter.inicio).toLocaleString()}}</p>
						</Panel>
						<Panel header="Fecha fin" class="mb-3 col-12 md:col-6">
							<p class="line-height-3 m-0">{{new Date(peticionParaPublicarConTwitter.fin).toLocaleString()}}</p>
						</Panel>
						<Panel header="Descripción" class="mb-3 col-12 md:col-12">
							<p class="line-height-3 m-0">{{peticionParaPublicarConTwitter.descripcion}}</p>
						</Panel>
						<Panel header="Imagen" class="col-12 md:col-12">
							<img v-if="peticionParaPublicarConTwitter.imagen" :src="peticionParaPublicarConTwitter.imagen" class="shadow-2" width="100" />
							<p v-else class="line-height-3 m-0">Sin imagen</p>
						</Panel>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" @click="closeDisplayTwitter" class="p-button-text p-button-danger"/>
						<Button label="Publicar" icon="pi pi-check" @click="publicarEnTwitter(peticionParaPublicarConTwitter)" class="p-button-text" autofocus/>
					</template>
				</Dialog>

				<Dialog header="Anunciar en Telegram" v-model:visible="displayTelegram" class="col-3" :modal="true">
					<div class="p-fluid formgrid grid" style="text-align: center; justify-content: center">
						<Panel header="ID del evento" class="mb-3 col-12 md:col-12">
							<p class="line-height-3 m-0">{{peticionParaPublicarConTelegram.idEvento}}</p>
						</Panel>
						<Panel header="Título" class="mb-3 col-12 md:col-12">
							<p class="line-height-3 m-0">{{peticionParaPublicarConTelegram.titulo}}</p>
						</Panel>
						<Panel header="Fecha inicio" class="mb-3 col-12 md:col-6">
							<p class="line-height-3 m-0">{{new Date(peticionParaPublicarConTelegram.inicio).toLocaleString()}}</p>
						</Panel>
						<Panel header="Fecha fin" class="mb-3 col-12 md:col-6">
							<p class="line-height-3 m-0">{{new Date(peticionParaPublicarConTelegram.fin).toLocaleString()}}</p>
						</Panel>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" @click="closeDisplayTelegram" class="p-button-text p-button-danger"/>
						<Button label="Anunciar" icon="pi pi-check" @click="publicarEnTelegram(peticionParaPublicarConTelegram)" class="p-button-text" autofocus />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import facebookAPI from '../service/FacebookApi';
import { obtenerAuthURL } from "../service/gmailService.js";
import { enviarEmail } from "../service/gmailService.js";
import { obtenerToken } from "../service/gmailService.js";
import { hacerSwal} from "../service/SwalService.js";
import { mails} from "../service/SwalService.js";
import LogoEventia from "@/assets/LogoEventia.png"
import axios from 'axios'


//const Swal = require('sweetalert2')
export default {
	data() {
		return {
			LogoEventia: LogoEventia,
			displayTwitter: false,
			displayTelegram: false,
			peticionesPublicacion: null,
			peticionPublicacionDraft: null,
			peticionPublicacionDialog: false,
			borrarPeticionPublicacionDialog: false,
			borrarPeticionesPublicacionDialog: false,
			peticionPublicacion: {
				inicio: null,
				fin: null,
			},
			peticionParaPublicarConFacebook: {},
			peticionParaPublicarConTwitter: {},
			peticionParaPublicarConTelegram: {},
			selectedPeticionesPublicacion: null,
			filters: {},
			submitted: false,
			codigoGmail:'',
			tokenMail:'',
			confirmarPublicacionFB: false,
			responseFB: null,
			fbText: null,
			overlayMenuItems: [
					{
						label: 'Publicar en Twitter',
						icon: 'pi pi-twitter',
                        command: () => {this.publicarEnTwitter()}
					},
					{
						label: 'Publicar en Facebook',
						icon: 'pi pi-facebook',
                        command: () => {this.publicarEnFacebook()}
					},
					{
						label: 'Publicar en Telegram',
						icon: 'pi pi-telegram',
                        command: () => {this.publicarEnTelegram()}
					},
					{
						label: 'Publicar en Gmail',
						icon: 'pi pi-at',
                        command: () => {this.publicarEnGmail()}
					},
				]
		}
	},
	servicioPeticionPublicaciones: null,
	created() {
		this.initFilters();
	},
	mounted() {
		if(window.location.search.startsWith('?code=')){
			
			let urlParams = new URLSearchParams(window.location.search);
			this.codigoGmail= urlParams.get('code');
			this.axios.get('/peticionesPublicacion').then(response=>{
				
				var evento=response.data.filter(p=>p.botonGmail===true)[0];
				console.log("el evento es",evento)
				obtenerToken(this.codigoGmail).then((response) => {
					this.tokenMail = JSON.stringify(response.tokens);
					console.log("llega aqui",mails)
					hacerSwal(()=>{
						
						enviarEmail(this.tokenMail,mails,evento)})
					
					const paramsFalse = {};
					paramsFalse['botonGmail'] = false;
					this.axios.put(`/peticionesPublicacion/${evento._id}`, paramsFalse)
				}).catch((e)=>{
					console.error('error' + e);
				})
			}).catch(error =>{
				console.error(error);
			});
		}


		this.axios.get('/peticionesPublicacion')
		.then((response) => {
			this.peticionesPublicacion = response.data;
		})
		.catch((e)=>{
			console.log('error' + e);
		})
	},
	methods: {
		actualizarBD() {
			this.axios.put('/actualizarBD')
			.then((response) => {
				console.log(response.data)
				if (response.data.length > 0) {
					for (let nuevoEvento of response.data)
						this.peticionesPublicacion.push(nuevoEvento);
					this.$toast.add({severity:'success', summary: 'Exito', detail: 'Base de datos actualizada (' + response.data.length + ' elementos nuevos)', life: 3000});
				} else {
					this.$toast.add({severity:'warn', summary: 'Sin cambios', detail: 'No hay eventos nuevos', life: 3000});
				}
			})
			.catch((e)=>{
				console.log('error' + e);
			})
		},
		openDisplayTwitter(peticion) {
			this.peticionParaPublicarConTwitter = peticion
			this.displayTwitter = true;
		},
		closeDisplayTwitter() {
			this.peticionParaPublicarConTwitter = {}
			this.displayTwitter = false;
		},
		publicarEnTwitter(request){
			if(request.imagen){
				let uriFoto = request.imagen.replaceAll("&","^&")
				let cuerpoDelTweet = request.titulo + " " + (new Date(request.inicio).toLocaleString()) + " " + uriFoto;
				console.log("Tweet con foto");
				let command = {};
				command["command"] = `node ./src/twitter-api/publicarTweetConImagen.js ${cuerpoDelTweet}`;
				this.axios.post('/tweet', command)
				.then((response) => {
					if(response.data.result.replace(/(\r\n|\n|\r)/gm,"") !== "undefined"){
						console.log(response.data);
						this.$toast.add({severity:'success', summary: 'Exito', detail: 'Evento publicado con éxito en Twitter', life: 3000});
					}else{
						this.$toast.add({severity:'error', summary: 'Error', detail: 'Este evento ya ha sido publicado en Twitter', life: 3000});
					}
					const paramsData = {};
					paramsData['publicadoTwitter'] = true;
					axios.put(`/peticionesPublicacion/${request._id}`, paramsData)
						.then(() => {
							this.peticionesPublicacion.find(p => p._id === request._id).publicadoTwitter = true;
							this.peticionParaPublicarConFacebook = {}
						}).catch(error =>{
							console.log(error);
						});
				})
				.catch((e)=>{
					console.log('error' + e);
					this.$toast.add({severity:'error', summary: 'Error', detail: 'No se pudo publicar el evento en Twitter', life: 3000});
				})
			}
			else{
				let cuerpoDelTweet = request.titulo + " " + (new Date(request.inicio).toLocaleString());
				console.log("Tweet sin foto");
				let command = {};
				command["command"] = `node ./src/twitter-api/publicarTweetSinImagen.js ${cuerpoDelTweet}`;
				this.axios.post('/tweet', command)
				.then((response) => {
					if(response.data.result.replace(/(\r\n|\n|\r)/gm,"") !== "undefined"){
						console.log(response.data);
						this.$toast.add({severity:'success', summary: 'Exito', detail: 'Evento publicado con éxito en Twitter', life: 3000});
					}else{
						this.$toast.add({severity:'error', summary: 'Error', detail: 'Este evento ya ha sido publicado en Twitter', life: 3000});
					}
					const paramsData = {};
					paramsData['publicadoTwitter'] = true;
					axios.put(`/peticionesPublicacion/${request._id}`, paramsData)
						.then(() => {
							this.peticionesPublicacion.find(p => p._id === request._id).publicadoTwitter = true;
							this.peticionParaPublicarConFacebook = {}
						}).catch(error =>{
							console.log(error);
						});
				})
				.catch((e)=>{
					console.log('error' + e);
					this.$toast.add({severity:'error', summary: 'Error', detail: 'No se pudo publicar el evento en Twitter', life: 3000});
				})
			}
			this.closeDisplayTwitter();
		},
		openDisplayTelegram(peticion) {
			this.peticionParaPublicarConTelegram = peticion
			this.displayTelegram = true;
		},
		closeDisplayTelegram() {
			this.peticionParaPublicarConTelegram = {}
			this.displayTelegram = false;
		},
		publicarEnTelegram(request){
			let cuerpoDelMensaje = request.idEvento + " " + (new Date(request.inicio).toLocaleString()) + " " + (new Date(request.fin).toLocaleString()) + " " + request.titulo;
			let command = {};
			command["command"] = `node ./src/service/TelegramChannelBotService.js ${cuerpoDelMensaje}`;
			this.axios.post('/telegram', command)
			.then((response) => {
				console.log(response.data);
				this.$toast.add({severity:'success', summary: 'Exito', detail: 'Evento anunciado con éxito en Telegram', life: 3000});
				const paramsData = {};
				paramsData['publicadoTelegram'] = true;
				axios.put(`/peticionesPublicacion/${request._id}`, paramsData)
					.then(() => {
						this.peticionesPublicacion.find(p => p._id === request._id).publicadoTelegram = true;
						this.peticionParaPublicarConFacebook = {}
					}).catch(error =>{
						console.log(error);
					});
			})
			.catch((e)=>{
				console.log('error' + e);
			})
			this.closeDisplayTelegram();
		},
		crearPeticionPublicacion() {
			window.open("https://www.eventbrite.com/manage/events/create")
		},
		publicarEnGmail(product){
			
			this.axios.get('/peticionesPublicacion').then(response=>{
				let promises=[]
				let eventoBueno=response.data.filter(p=>p.botonGmail===true && p._id===product._id).length
				if(eventoBueno===0){
					promises.push(this.axios.put('/peticionesPublicacion/'+product._id, {botonGmail:true}))
				}
				let events=response.data.filter(p=>p.botonGmail===true && p._id!=product._id)
				for(let i=0;i<events.lenght;i++){
					promises.push(this.axios.put('/peticionesPublicacion/'+events[i]._id, {botonGmail:false}))
				}
				Promise.all(promises).then(()=>{
					var authUrl= obtenerAuthURL();	
					console.log(authUrl)		
					location.href=authUrl;  
				})
			})	
		}, 
		hideDialog() {
			this.peticionPublicacionDialog = false;
			this.submitted = false;
		},
		actualizarPeticionPublicacion() {
			this.submitted = true;
			if (this.peticionPublicacion.titulo.trim()) {
				if (this.peticionPublicacion._id) {
					let original = this.peticionesPublicacion.find(p => p._id === this.peticionPublicacionDraft._id)
					if (original.titulo !== this.peticionPublicacion.titulo || original.descripcion !== this.peticionPublicacion.descripcion || original.inicio !== this.peticionPublicacion.inicio || original.fin !== this.peticionPublicacion.fin){
						this.peticionPublicacion.publicadoFacebook = false;
						this.peticionPublicacion.publicadoTwitter = false;
						this.peticionPublicacion.publicadoTelegram = false;
						
						this.axios.put('/peticionesPublicacion/' + this.peticionPublicacion._id, this.peticionPublicacion)
						.then(() => {
							this.peticionesPublicacion[this.findIndexById(this.peticionPublicacion._id)] = this.peticionPublicacion;
							this.axios.get('/peticionesPublicacion')
							.then((response) => {
								this.peticionesPublicacion = response.data;
							})
							.catch((e)=>{
								console.log('error' + e);
							})
							this.$toast.add({severity:'success', summary: 'Exito', detail: 'Peticion de publicacion actualizada', life: 3000});
						})
						.catch((e)=>{
							console.log('error' + e);
						})
					}
				}
				this.peticionPublicacionDialog = false;
				this.peticionPublicacion = {};
			}
		},
		editarPeticionPublicacion(peticionPublicacion) {
			this.peticionPublicacion = {...peticionPublicacion};
			this.peticionPublicacionDraft = {...peticionPublicacion};
			this.peticionPublicacionDialog = true;
		},
		confirmarBorrarPeticionPublicacion(peticionPublicacion) {
			this.peticionPublicacion = peticionPublicacion;
			this.borrarPeticionPublicacionDialog = true;
		},
		borrarPeticionPublicacion() {
			this.axios.delete('/peticionesPublicacion/' + this.peticionPublicacion._id)
			.then(() => {
				this.axios.get('/peticionesPublicacion')
				.then((response) => {
					this.peticionesPublicacion = response.data;
				})
				.catch((e)=>{
					console.log('error' + e);
				})

				this.$toast.add({severity:'success', summary: 'Exito', detail: 'Peticion de publicacion eliminada', life: 3000});
			})
			.catch((e)=>{
				console.log('error' + e);
			})

			this.borrarPeticionPublicacionDialog = false;
			this.peticionPublicacion = {};
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.peticionesPublicacion.length; i++) {
				if (this.peticionesPublicacion[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmBorrarSelected() {
			this.borrarPeticionesPublicacionDialog = true;
		},
		borrarSelectedPeticionesPublicacion() {
			let promesas = []
			this.borrarPeticionesPublicacionDialog = false;

			for (let peticion of this.selectedPeticionesPublicacion) {
				promesas.push(this.axios.delete('/peticionesPublicacion/' + peticion._id)
				.catch((e)=>{
					console.log('error' + e);
				}))
			}

			Promise.all(promesas)
			.then(() => {
				this.selectedPeticionesPublicacion = null;

				this.axios.get('/peticionesPublicacion')
				.then((response) => {
					this.peticionesPublicacion = response.data;
					this.$toast.add({severity:'success', summary: 'Exito', detail: 'Peticiones de publicacion eliminadas', life: 3000});
				})
				.catch((e)=>{
					console.log('error' + e);
				})
			})
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        },
		toggleMenu(event) {
			this.$refs.menu.toggle(event);
		},
		confirmarPublicacionFacebook(peticionPublicacion){
			this.peticionParaPublicarConFacebook = peticionPublicacion
			var fechaInicio = new Date(peticionPublicacion.inicio).toLocaleDateString();
			var horaInicio = new Date(peticionPublicacion.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			this.fbText = "El evento " + peticionPublicacion.titulo + ", se celebrará el " + fechaInicio + " a las " + horaInicio + (peticionPublicacion.descripcion ?  ".\n" + peticionPublicacion.descripcion + "." : ".");
			this.confirmarPublicacionFB = true;
		},
		async publicarEnFacebook(){
			var request = this.fbText;
			var imagen = this.peticionParaPublicarConFacebook.imagen;
			
			if(imagen){
				this.responseFB = await facebookAPI.fbPostPhotoOnPage(request, imagen);
				this.establecerPublicado(this.peticionParaPublicarConFacebook);
			}else{
				this.responseFB = await facebookAPI.fbPostOnPage(request);	
				this.establecerPublicado(this.peticionParaPublicarConFacebook);
			}
		},
		async establecerPublicado(request){
			if(this.responseFB == '200') {
				const paramsData = {};
				paramsData['publicadoFacebook'] = true;
				await this.axios.put(`/peticionesPublicacion/${request._id}`, paramsData)
					.then(() => {
						this.peticionesPublicacion.find(p => p._id === request._id).publicadoFacebook = true;
						this.peticionParaPublicarConFacebook = {}
					}).catch(error =>{
						console.log(error);
					});
				this.$toast.add({severity:'success', summary: 'Exito', detail: 'Evento publicado en Facebook', life: 3000});
				this.confirmarPublicacionFB = false;
			} else {
				this.$toast.add({severity:'error', summary: 'Error', detail: `No se pudo publicar el evento en Facebook: ${this.responseFB}.`, life: 3000});
			}
		},
		cancelarPublicarFacebook() {
			this.confirmarPublicacionFB = false
			this.peticionParaPublicarConFacebook = {}
		}
	}
}
</script>

<style lang="scss">

.p-panel .p-panel-header {
	place-content: center;
}
</style>
