package com.vesselguard.dto;

public class PatientRequest {
    private Long userId;
    private String name;
    private Integer age;
    private String gender;
    private String contact;
    private Double height;
    private Double weight;
    private Integer cp;
    private Integer trestbps;
    private Integer chol;
    private Integer fbs;
    private Integer restecg;
    private Integer thalach;
    private Integer exang;
    private Double oldpeak;
    private Integer slope;
    private Integer ca;
    private Integer thal;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getCp() {
        return cp;
    }

    public void setCp(Integer cp) {
        this.cp = cp;
    }

    public Integer getTrestbps() {
        return trestbps;
    }

    public void setTrestbps(Integer trestbps) {
        this.trestbps = trestbps;
    }

    public Integer getChol() {
        return chol;
    }

    public void setChol(Integer chol) {
        this.chol = chol;
    }

    public Integer getFbs() {
        return fbs;
    }

    public void setFbs(Integer fbs) {
        this.fbs = fbs;
    }

    public Integer getRestecg() {
        return restecg;
    }

    public void setRestecg(Integer restecg) {
        this.restecg = restecg;
    }

    public Integer getThalach() {
        return thalach;
    }

    public void setThalach(Integer thalach) {
        this.thalach = thalach;
    }

    public Integer getExang() {
        return exang;
    }

    public void setExang(Integer exang) {
        this.exang = exang;
    }

    public Double getOldpeak() {
        return oldpeak;
    }

    public void setOldpeak(Double oldpeak) {
        this.oldpeak = oldpeak;
    }

    public Integer getSlope() {
        return slope;
    }

    public void setSlope(Integer slope) {
        this.slope = slope;
    }

    public Integer getCa() {
        return ca;
    }

    public void setCa(Integer ca) {
        this.ca = ca;
    }

    public Integer getThal() {
        return thal;
    }

    public void setThal(Integer thal) {
        this.thal = thal;
    }
}
