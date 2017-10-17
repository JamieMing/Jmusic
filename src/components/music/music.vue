<template>
    <div class="music">
        <tab></tab>
        <router-view></router-view>
    </div>
</template>
<script>
import Tab from 'components/tab/tab'

export default {
    components: {
        Tab
    }
}
</script>