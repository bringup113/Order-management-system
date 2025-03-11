<template>
  <component :is="type" v-bind="linkProps">
    <slot />
  </component>
</template>

<script>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

export default {
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isExternalLink = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (isExternalLink.value) {
        return 'a'
      }
      return 'router-link'
    })
    const linkProps = computed(() => {
      if (isExternalLink.value) {
        return {
          href: props.to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: props.to
      }
    })

    return {
      isExternalLink,
      type,
      linkProps
    }
  }
}
</script> 