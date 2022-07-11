<script setup lang="ts">

import { dslCall } from '@lowcode/core'

dslCall('test',18)
.then((res) => {
  console.log(`###res is `,res)
})

</script>

<template>
  <div>123</div>
</template>
