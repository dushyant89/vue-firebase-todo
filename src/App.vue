<template>
    <v-app>
        <div id="app">
            <!-- App navigation -->
            <v-navigation-drawer app>
                <v-toolbar flat>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title class="title">
                                Application
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list dense class="pt-0">
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-content>
                                <router-link to="/">Home</router-link>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <router-link to="/about">About</router-link>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-list>
            </v-navigation-drawer>
            <!-- App content -->
            <v-content>
                <v-container fluid>
                    <router-view/>
                </v-container>
            </v-content>
        </div>
    </v-app>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
