function init() {
  // * Dom Elements
  const grid = document.querySelector('.grid')
  const flagsRemainingDisplay = document.querySelector('.flags-remaining')
  const cells = []
  const mineCount = 40
  const mineLocations = []
  const blankedCells = []
  const revisitCells = []

  // * Grid variables
  const width = 16
  const cellCount = width * width
  const mineNeighbours = new Array(cellCount).fill(0)

  // * Variable variables
  let flagsRemaining = mineCount

  function createGrid() {

    cells.forEach(cell => {
      cell.parentElement.removeChild(cell)
    })

    grid.style.width = `${width * 18}px`
    grid.style.height = `${width * 18}px`
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.id = i
      cell.classList.add('unclicked')
      grid.appendChild(cell)
      cells.push(cell)
    }
    cells.forEach(cell => {
      cell.addEventListener('click', handleClickedCell)
      cell.addEventListener('contextmenu', handleRightClickedCell)
    })
  }

  function handleRightClickedCell(event) {
    event.preventDefault()
    const targetCell = parseInt(event.target.id)

    if (cells[targetCell].classList.contains('unclicked') &&
      !cells[targetCell].classList.contains('flag') &&
      !cells[targetCell].classList.contains('question')) {
      addFlag(targetCell)
    } else if (cells[targetCell].classList.contains('flag')) {
      addQuestionMark(targetCell)
    } else if (cells[targetCell].classList.contains('question')) {
      removeQuestionMark(targetCell)
    }
  }

  function removeFlag(targetCell) {
    cells[targetCell].classList.remove('flag')
    flagsRemaining++
    flagsRemainingDisplay.innerHTML = flagsRemaining
  }

  function addFlag(targetCell) {
    cells[targetCell].classList.add('flag')
    flagsRemaining--
    flagsRemainingDisplay.innerHTML = flagsRemaining
  }

  function addQuestionMark(targetCell) {
    removeFlag(targetCell)
    cells[targetCell].classList.add('question')
  }

  function removeQuestionMark(targetCell) {
    cells[targetCell].classList.remove('question')
  }

  function handleClickedCell(event) {
    const targetCell = parseInt(event.target.id)
    if (mineLocations.includes(targetCell)) {
      if (!cells[targetCell].classList.contains('flag')) {
        userClickedMine(targetCell)
      }
    } else if (mineNeighbours[targetCell] > 0) {
      revealNeighbours(targetCell)
    } else {
      revealOneLevelOfBlanks(targetCell)
    }
    checkWin()
  }

  function checkWin() {
    const openedCells = cells.filter(cell => {
      return !cell.classList.contains('unclicked')
    }).length
    if (openedCells === cellCount - mineCount) {
      window.alert('YOU WON!')
    }
  }

  function userClickedMine(cellClicked) {
    cells.forEach((cell, i) => {
      if (mineLocations.includes(i)) {
        cell.classList.add('exploded')
      }
      cell.classList.remove('unclicked')
    })
    cells[cellClicked].classList.add('first-exploded')
    window.alert('You\'re Only Supposed to Blow The B****y Doors Off!')
  }

  function cellIsInside(cell) {
    return cell % width !== width - 1 || cell % width !== 0
  }


  // * Uncover Cell Functions
  function revealNeighbours(targetCell) {
    const numberOfNeighbours = mineNeighbours[targetCell]
    cells[targetCell].classList.remove('unclicked')
    cells[targetCell].classList.add(`m${numberOfNeighbours}`)
    if (!revisitCells.includes(targetCell) && !blankedCells.includes(targetCell)) {
      blankedCells.push(targetCell)
      if ((cellIsInside(targetCell)) && cells[targetCell].classList.contains('m0')) {
        revisitCells.push(targetCell)
      }
    }
  }

  function revealOneLevelOfBlanks(startCell, recursive = true) {
    revealNeighbours(startCell)
    if (startCell % width !== width - 1) {
      revealNeighbours(startCell + 1)
      if (Math.floor(startCell / width) !== 0) {
        revealNeighbours(startCell - width + 1)
      }
      if (Math.floor(startCell / width) !== width - 1) {
        revealNeighbours(startCell + width + 1)
      }
    }

    if (startCell % width !== 0) {
      revealNeighbours(startCell - 1)
      if (Math.floor(startCell / width) !== 0) {
        revealNeighbours(startCell - width - 1)
      }
      if (Math.floor(startCell / width) !== width - 1) {
        revealNeighbours(startCell + width - 1)
      }
    }

    if (Math.floor(startCell / width) !== width - 1) {
      revealNeighbours(startCell + width)
    }
    if (Math.floor(startCell / width) !== 0) {
      revealNeighbours(startCell - width)
    }
    if (revisitCells.includes(startCell)) {
      revealAdditionalBlanks()
    }
    if (recursive) revealAdditionalBlanks()
  }

  function revealAdditionalBlanks() {
    revisitCells.shift()
    revisitCells.forEach(cell => {
      revealOneLevelOfBlanks(cell, false)
      revisitCells.length = 0
    })
  }

  // * Game Start functions

  function createMineLocations() {
    while (mineLocations.length < mineCount) {
      const randomCell = Math.floor(Math.random() * cellCount)
      if (!mineLocations.includes(randomCell)) {
        mineLocations.push(randomCell)
      }
    }
  }

  function createNeighborNumbers() {
    cells.forEach((cell, i) => {
      if (mineLocations.includes(i)) {
        if (i % width !== width - 1) {
          mineNeighbours[i + 1]++
          mineNeighbours[i - width + 1]++
          mineNeighbours[i + width + 1]++
        }
        if (i % width !== 0) {
          mineNeighbours[i - 1]++
          mineNeighbours[i - width - 1]++
          mineNeighbours[i + width - 1]++
        }
        mineNeighbours[i + width]++
        mineNeighbours[i - width]++
      }
    })
  }

  function startGame() {
    createGrid()
    createMineLocations()
    createNeighborNumbers()
    flagsRemainingDisplay.innerHTML = flagsRemaining
  }

  startGame()
  console.log('If you\'re looking here you\'ll probably be interested in looking at my code, find it here:\nhttps://github.com/jompra')
}

window.addEventListener('DOMContentLoaded', init)