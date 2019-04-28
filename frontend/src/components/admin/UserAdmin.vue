<template>
    <div class="user-admin">
        <header class="text-center">
            <div class="title" v-show="this.mode=='save' || this.mode=='remove'">
                <h1 class="sm">Usuários</h1>
                <b-button variant="outline-primary" @click="showRemoved">
                    Ir para deletados 
                    <i class="fa fa-angle-double-down"></i>
                </b-button>
            </div>
            <div class="title" v-show="this.mode==='removed'">
                <h1 class="sm">Usuários deletados</h1>
                <b-button variant="primary" @click="reset">voltar <i class="fa fa-angle-double-up"></i></b-button>
            </div>
        </header>
        <b-form>
            <input type="hidden" id="user-id" v-model="user.id"/>
            <b-row v-show="this.mode==='save' || this.mode==='remove'">
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="user-name">
                        <b-form-input id="user-name" type="text" 
                            v-model="user.name" required
                            :readonly="mode==='remove'"
                            placeholder="Informe o nome do usuário"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Email:" label-for="user-email">
                        <b-form-input id="user-email" type="text" 
                            v-model="user.email" required
                            :readonly="mode==='remove'"
                            placeholder="Informe o email do usuário"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-form-checkbox id="user-admin" 
                v-model="user.admin" 
                class="mt-3 mb-3"
                v-show="mode==='save'">
                    Administrador?
            </b-form-checkbox>
            <b-row v-show="mode==='save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-password">
                        <b-form-input id="user-password" type="password" 
                            v-model="user.password" required
                            placeholder="Informe a senha do usuário"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirme a senha:" label-for="user-confirmPassword">
                        <b-form-input id="user-comfirmPassword" type="password" 
                            v-model="user.confirmPassword" required
                            placeholder="Confirme a senha do usuário"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode==='save'" @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode==='remove'" @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset" v-show="this.mode==='save' || this.mode==='remove'">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>
        <b-table hover striped :items="users" :fields="fields" v-if="this.mode==='save' || this.mode==='remove'">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-table hover striped :items="users" :fields="fields" v-else>
            <template slot="actions" slot-scope="data">
                <b-button variant="success" @click="restoreUser(data.item)" class="mr-2" alt="restaurar usuário">
                    <i class="fa fa-refresh"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import axios from 'axios'
import {baseApiUrl, showError} from '@/global'

export default {
    name:'UserAdmin',
    data: function(){
        return{
            haveUpdate: false,
            mode: 'save',
            user: {},
            users: [],
            fields: [
                {key: 'id', label: 'Codigo', sortable: true},
                {key: 'name', label: 'Nome', sortable: true},
                {key: 'email', label: 'E-mail', sortable: true},
                {key: 'admin', label: 'Administrador', sortable: true,
                    formatter: value=> value? 'Sim': 'Não'},
                {key: 'actions', label: 'Ações'}
            ]
        }
    },
    methods: {
        loadUsers(path = '/users'){
            const url = baseApiUrl+path
            axios.get(url).then(res =>{
                this.users = res.data
            })
        },
        reset(){
            this.mode='save'
            this.user={}
            this.loadUsers()
        },
        save(){
            const method = this.user.id ? 'put':'post'
            const id = this.user.id ? `/${this.user.id}`:''
            axios[method](`${baseApiUrl}/users${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove(){
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode='save'){
            this.mode = mode
            this.user = {...user}
        },
        showRemoved(){
            this.mode = 'removed'
            this.loadUsers('/usersdeleted')
        },
        restoreUser(item){
            axios.get(`${baseApiUrl}/usersdeleted/${item.id}`).then(() => {
                this.$toasted.global.defaultSuccess()
                this.loadUsers('/usersdeleted')
            })
            .catch(showError)
        }
    },
    mounted(){
        this.loadUsers();
    }
}
</script>

<style>
.text-center h1{
    font-size: 1.3em;
}
.title .fa{
    vertical-align: middle
}
.title{
    margin-bottom: 20px;
    display: grid;
    grid-template-rows: 1fr 1fr;
}
</style>
