<template>
  <div>
    <v-form style="width:50%; margin: 0 auto;">
      <v-text-field
        v-model="name"
        name="name"
        :counter="10"
        label="Name"
        required
      />
      <v-text-field v-model="email" label="E-mail" name="email" required />

      <v-row justify="space-around">
        <v-date-picker
          v-model="picker"
          :first-day-of-week="0"
          locale="ru-ru"
          :allowed-dates="allowedDates"
          full-width
          :min="mindate"
          :max="maxdate"
        />
      </v-row>
      <v-text-field
        :value="picker"
        label="Желаемая дата"
        required
        name="picker"
      />

      <v-select
        :id="picker"
        v-model="time"
        :items="times"
        item-text="value"
        item-value="value"
        item-disabled="disabled"
        label="Желаемое время"
        outlined
        name="time"
      />

      <v-btn class="mr-4" @click="newNotes">
        Записаться
      </v-btn>
    </v-form>
    {{ arrayDates }}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      arrayDates: [],
      times: [
        { value: '09:00', disabled: false },
        { value: '10:00', disabled: false },
        { value: '11:00', disabled: false },
        { value: '12:00', disabled: false }
      ],
      time: '',
      name: '',
      email: '',
      respnotes: '',
      mindate: new Date(Date.now() - 88888888).toISOString().substr(0, 10),
      maxdate: new Date(Date.now() + 888860000).toISOString().substr(0, 10),
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    }
  },
  mounted () {
    this.getpickers()
    // console.log(this.arrayDates)
  },
  methods: {
    async getpickers () {
      await axios
        .get('http://localhost:3000/api/notes')
        .then(response => (this.respnotes = response.data))
      // console.log(this.respnotes.length)
      // console.log(res)

      for (let i = 0; i < this.respnotes.length; i++) {
        this.arrayDates.push([
          new Date(this.respnotes[i].picker).toISOString().substr(0, 10),
          this.respnotes[i].time
        ])
      }
      // console.log(this.arrayDates)
      return this.arrayDates
    },
    allowedDates (val) {
      return val
    },

    newNotes () {
      const formData = {
        name: this.name,
        email: this.email,
        picker: this.picker,
        time: this.time
      }

      axios
        .post('http://localhost:3000/api/notes', formData)

        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
