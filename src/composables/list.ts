export function listBothEnds(list: Map<HTMLDivElement, boolean>, type: 'start' | 'end') {
  let result = 0
  if (!list.size)
    return result

  const rList = [...list.values()]

  if (type === 'start') {
    for (let i = 0; i < rList.length; i++) {
      if (!rList[i])
        result += 1
      else
        break
    }
  }
  else {
    for (let i = rList.length - 1; i >= 0; i--) {
      if (!rList[i])
        result += 1
      else
        break
    }
  }

  return result
}
