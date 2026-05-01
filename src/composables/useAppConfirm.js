import { useConfirmStore } from '@/store/confirm'

export function useAppConfirm() {
  const store = useConfirmStore()
  return {
    require: (options) => store.require(options),
    close: () => store.close()
  }
}


