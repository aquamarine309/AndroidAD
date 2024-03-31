export const hotkeys = [
  {
    id: 0,
    label: "Max",
    active: () => maxAll()
  },
  {
    id: 1,
    label: "D",
    active: () => requestDimensionBoost(true),
    condition: () => true,
    mark: () => DimBoost.requirement.isSatisfied && DimBoost.canBeBought
  },
  {
    id: 2,
    label: "G",
    active: () => requestGalaxyReset(EternityMilestone.autobuyMaxGalaxies.isReached),
    condition: () => true,
    mark: () => Galaxy.requirement.isSatisfied && Galaxy.canBeBought
  },
  {
    id: 3,
    label: "C",
    active: () => bigCrunchReset(),
    condition: () => PlayerProgress.infinityUnlocked(),
  },
  {
    id: 4,
    label: "R",
    active: () => replicantiGalaxy(),
    condition: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked(),
    mark: () => Replicanti.canBuyMore
  },
  {
    id: 5,
    label: "E",
    active: () => eternity(),
    condition: () => PlayerProgress.eternityUnlocked(),
  },
  {
    id: 6,
    label: "Y",
    active: () => {},
    condition: () => PlayerProgress.realityUnlocked(),
  }
]