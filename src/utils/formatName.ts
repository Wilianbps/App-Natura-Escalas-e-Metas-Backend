export function formatName(name: string | undefined) {
  if (name) {
    const parts = name?.toLowerCase().split(' ')

    // Capitaliza a primeira letra de cada parte do nome
    for (let i = 0; i < parts?.length; i++) {
      parts[i] = parts[i]?.charAt(0).toUpperCase() + parts[i]?.substring(1)
    }

    // Junta as partes do nome novamente
    return parts?.join(' ')
  }
}